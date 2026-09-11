import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as api from '../adminApi'
import { Btn, Badge, Input, Select, Spinner, ErrorBanner, EmptyState, Card, Field } from '../ui'

const STATUS_TONE = {
  ACTIVE: 'neutral',
  B2B_PENDING: 'amber',
  CORPORATE_PENDING: 'amber',
  B2B_APPROVED: 'green',
  CORPORATE_APPROVED: 'green',
  B2B_REJECTED: 'red',
  CORPORATE_REJECTED: 'red',
  SUSPENDED: 'red',
}

export default function CustomerList() {
  const [params, setParams] = useSearchParams()
  const [state, setState] = useState({ loading: true, items: [], meta: null, error: null })
  const [acting, setActing] = useState(null) // customer being approved/rejected

  const query = {
    status: params.get('status') ?? '',
    accountType: params.get('accountType') ?? '',
    search: params.get('search') ?? '',
    page: Number(params.get('page') ?? 1),
    limit: 50,
  }

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true }))
    api
      .listCustomers(query)
      .then(({ items, meta }) => setState({ loading: false, items, meta, error: null }))
      .catch((error) => setState({ loading: false, items: [], meta: null, error }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(load, [load])

  function setParam(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setParams(next)
  }

  async function approve(customer, tier) {
    try {
      await api.approveCustomer(customer.id, tier ? { tier } : {})
      setActing(null)
      load()
    } catch (error) {
      setState((s) => ({ ...s, error }))
    }
  }

  async function reject(customer, reason) {
    try {
      await api.rejectCustomer(customer.id, reason)
      setActing(null)
      load()
    } catch (error) {
      setState((s) => ({ ...s, error }))
    }
  }

  const pending = state.meta?.pendingCount ?? 0
  const resellerPending = state.meta?.resellerPendingCount ?? 0

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Customers</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {state.meta ? `${state.meta.total} accounts` : ''}
            {pending > 0 && (
              <span className="ml-2 font-medium text-amber-700">
                · {pending} awaiting approval
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {pending > 0 && query.status !== 'PENDING' && (
            <Btn onClick={() => setParam('status', 'PENDING')}>Review {pending} pending</Btn>
          )}
          {resellerPending > 0 && query.status !== 'RESELLER_PENDING' && (
            <Btn variant="outline" onClick={() => setParam('status', 'RESELLER_PENDING')}>
              {resellerPending} reseller application{resellerPending === 1 ? '' : 's'}
            </Btn>
          )}
        </div>
      </div>

      <ErrorBanner error={state.error} onDismiss={() => setState((s) => ({ ...s, error: null }))} />

      <div className="flex flex-wrap gap-2">
        <Input
          defaultValue={query.search}
          onKeyDown={(e) => e.key === 'Enter' && setParam('search', e.target.value)}
          placeholder="Search name, email or business… (Enter)"
          className="w-full sm:w-72"
        />
        <Select value={query.status} onChange={(e) => setParam('status', e.target.value)} className="w-auto">
          <option value="">All statuses</option>
          <option value="PENDING">Awaiting approval</option>
          <option value="ACTIVE">Active (retail)</option>
          <option value="B2B_APPROVED">Trade approved</option>
          <option value="CORPORATE_APPROVED">Corporate approved</option>
          <option value="B2B_REJECTED">Trade declined</option>
          <option value="CORPORATE_REJECTED">Corporate declined</option>
          <option value="RESELLER_PENDING">Reseller applications</option>
          <option value="RESELLERS">Resellers</option>
        </Select>
        <Select
          value={query.accountType}
          onChange={(e) => setParam('accountType', e.target.value)}
          className="w-auto"
        >
          <option value="">All types</option>
          <option value="B2C">B2C</option>
          <option value="B2B">B2B</option>
          <option value="CORPORATE">Corporate</option>
        </Select>
      </div>

      {acting && (
        <ReviewPanel
          customer={acting}
          onApprove={approve}
          onReject={reject}
          onCancel={() => setActing(null)}
        />
      )}

      {state.loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : state.items.length === 0 ? (
        <EmptyState
          title="No customers match"
          description="Customers appear here once people register on the site."
        />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
          <table className="w-full min-w-[62rem] text-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Business</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Priced at</th>
                <th className="px-4 py-3 font-semibold">Reseller</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {state.items.map((c) => {
                const isPending = c.status.endsWith('_PENDING')
                return (
                  <tr key={c.id} className="border-b border-line last:border-0 hover:bg-surface/60">
                    <td className="px-4 py-3">
                      <span className="block font-medium text-ink">{c.name}</span>
                      <span className="text-xs text-ink-soft">{c.email}</span>
                      {c.phone && <span className="block text-xs text-ink-soft">{c.phone}</span>}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {c.businessProfile?.businessName ?? '—'}
                      {c.businessProfile?.gstin && (
                        <code className="mt-0.5 block text-[0.7rem]">{c.businessProfile.gstin}</code>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONE[c.status] ?? 'neutral'}>
                        {c.status.replace(/_/g, ' ').toLowerCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={c.resolvedTier === 'B2C' ? 'neutral' : 'green'}>{c.resolvedTier}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <ResellerCell customer={c} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                      {isPending ? (
                        <Btn size="sm" onClick={() => setActing(c)}>
                          Review
                        </Btn>
                      ) : c.resolvedTier !== 'B2C' ? (
                        <Btn
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (!window.confirm(`Return ${c.name} to retail pricing?`)) return
                            try {
                              await api.revokeCustomerTier(c.id)
                              load()
                            } catch (error) {
                              setState((s) => ({ ...s, error }))
                            }
                          }}
                        >
                          Revoke
                        </Btn>
                      ) : null}
                        <ResellerActions
                          customer={c}
                          onDone={load}
                          onError={(error) => setState((s) => ({ ...s, error }))}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const RESELLER_TONE = { PENDING: 'amber', ACTIVE: 'green', PAUSED: 'neutral' }

/** A reseller's standing — or, for a customer, which reseller they belong to. */
function ResellerCell({ customer: c }) {
  if (c.reseller) {
    return (
      <div>
        <Badge tone={RESELLER_TONE[c.reseller.status] ?? 'neutral'}>
          {c.reseller.status === 'PENDING' ? 'applied' : c.reseller.status.toLowerCase()}
        </Badge>
        {c.reseller.code && <code className="ml-1 text-[0.7rem] text-ink-soft">{c.reseller.code}</code>}
        {c.reseller.storeName && <span className="mt-0.5 block text-xs text-ink-soft">{c.reseller.storeName}</span>}
      </div>
    )
  }
  if (c.referredBy) {
    return <span className="text-xs text-ink-soft">Customer of {c.referredBy.storeName}</span>
  }
  return <span className="text-ink-soft">—</span>
}

function ResellerActions({ customer: c, onDone, onError }) {
  const status = c.reseller?.status

  async function act(action, extra = {}) {
    try {
      await api.setReseller(c.id, { action, ...extra })
      onDone()
    } catch (error) {
      onError(error)
    }
  }

  if (status === 'PENDING') {
    return (
      <>
        <Btn size="sm" onClick={() => act('approve')}>
          Approve reseller
        </Btn>
        <Btn variant="ghost" size="sm" onClick={() => act('decline')}>
          Decline
        </Btn>
      </>
    )
  }
  if (status === 'ACTIVE') {
    return (
      <Btn
        variant="ghost"
        size="sm"
        onClick={() =>
          window.confirm(`Pause ${c.name}'s reseller account? Their customers go back to normal retail pricing.`) &&
          act('pause')
        }
      >
        Pause reseller
      </Btn>
    )
  }
  if (status === 'PAUSED') {
    return (
      <Btn variant="outline" size="sm" onClick={() => act('resume')}>
        Resume reseller
      </Btn>
    )
  }
  // Only a trade-approved account has a margin to earn.
  if (c.resolvedTier !== 'B2C') {
    return (
      <Btn
        variant="outline"
        size="sm"
        onClick={() => {
          const name = window.prompt('Store name their customers will see', c.businessProfile?.businessName ?? c.name)
          if (name && name.trim().length >= 2) act('approve', { storeName: name.trim() })
        }}
      >
        Make reseller
      </Btn>
    )
  }
  return null
}

function ReviewPanel({ customer, onApprove, onReject, onCancel }) {
  const applied = customer.accountType
  const [tier, setTier] = useState(applied)
  const [reason, setReason] = useState('')
  const [mode, setMode] = useState(null) // 'approve' | 'reject'

  return (
    <Card
      title={`Review — ${customer.name}`}
      description={`Applied for ${applied}. Currently priced at ${customer.resolvedTier}.`}
      actions={
        <Btn variant="outline" size="sm" onClick={onCancel}>
          Close
        </Btn>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Detail label="Business name" value={customer.businessProfile?.businessName} />
        <Detail label="GSTIN" value={customer.businessProfile?.gstin} />
        <Detail label="Business type" value={customer.businessProfile?.businessType} />
        <Detail label="Address" value={customer.businessProfile?.address} />
        <Detail label="Email" value={customer.email} />
        <Detail label="Phone" value={customer.phone} />
      </div>

      <p className="mt-4 rounded-[var(--radius-card)] bg-surface px-4 py-3 text-xs text-ink-soft">
        Verify the GSTIN against the business name before approving. Approval immediately changes
        what this customer is charged across the whole site.
      </p>

      {mode === null && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Btn onClick={() => setMode('approve')}>Approve</Btn>
          <Btn variant="danger" onClick={() => setMode('reject')}>
            Decline
          </Btn>
        </div>
      )}

      {mode === 'approve' && (
        <div className="mt-4 space-y-3 border-t border-line pt-4">
          <Field label="Approve onto tier" hint="You can grant a different tier from the one applied for.">
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full rounded-[var(--radius-card)] border border-line bg-white px-3 py-2 text-sm sm:w-52"
            >
              <option value="B2B">B2B — Trade</option>
              <option value="CORPORATE">Corporate</option>
            </select>
          </Field>
          <div className="flex gap-2">
            <Btn onClick={() => onApprove(customer, tier)}>Confirm approval</Btn>
            <Btn variant="outline" onClick={() => setMode(null)}>
              Back
            </Btn>
          </div>
        </div>
      )}

      {mode === 'reject' && (
        <div className="mt-4 space-y-3 border-t border-line pt-4">
          <Field label="Reason" hint="Shown to the customer on their account page.">
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="GSTIN could not be verified"
            />
          </Field>
          <p className="text-xs text-ink-soft">
            The account keeps working at retail pricing — declining does not lock them out.
          </p>
          <div className="flex gap-2">
            <Btn variant="danger" disabled={!reason.trim()} onClick={() => onReject(customer, reason.trim())}>
              Confirm decline
            </Btn>
            <Btn variant="outline" onClick={() => setMode(null)}>
              Back
            </Btn>
          </div>
        </div>
      )}
    </Card>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <span className="block text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </span>
      <span className="mt-0.5 block text-sm text-ink">{value || '—'}</span>
    </div>
  )
}
