import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Reveal from '../primitives/Reveal'
import Icon from '../primitives/Icon'
import { company, pendingCredentials } from '../../data/company'

export default function BusinessCredentialsSection() {
  /**
   * A credential is only rendered once it holds a real, confirmed value.
   * Anything still flagged in `pendingCredentials` — or simply left blank in
   * company.credentials — is omitted from the page entirely rather than shown
   * as "Pending verification". Fill the value in src/data/company.js and flip
   * its `pendingCredentials` flag to false and the card appears on its own.
   */
  const creds = [
    {
      label: 'Legal Entity Name',
      value: company.legalName || company.name,
      icon: 'briefcase',
    },
    {
      label: 'Constitution / Legal Form',
      value: company.credentials?.legalEntity || 'Private Limited Company',
      icon: 'layers',
    },
    {
      label: 'Corporate Identification Number (CIN)',
      value: company.credentials?.cin,
      pending: pendingCredentials.cin,
      icon: 'document',
    },
    {
      label: 'GSTIN Registration',
      value: company.credentials?.gstin,
      pending: pendingCredentials.gstin,
      icon: 'shield-check',
    },
    {
      label: 'Permanent Account Number (PAN)',
      value: company.credentials?.pan,
      pending: pendingCredentials.pan,
      icon: 'document',
    },
    {
      label: 'Udyam MSME Registration',
      value: company.credentials?.udyam,
      pending: pendingCredentials.udyam,
      icon: 'award',
    },
    {
      label: 'Date of Incorporation',
      value: company.credentials?.incorporationDate,
      pending: pendingCredentials.incorporationDate,
      icon: 'calendar',
    },
  ].filter((c) => !c.pending && c.value)

  return (
    <Section id="credentials" tone="surface">
      <SectionHeading
        eyebrow="Compliance & Trust"
        title="Business Credentials & Corporate Info"
        intro="Official corporate structure and documentation details prepared for institutional relationships, vendor registrations, and funding eligibility."
        className="mb-12"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Credentials Cards */}
        {creds.map((c, i) => (
          <Reveal
            key={c.label}
            delay={i * 0.05}
            className="flex flex-col justify-between rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-soft"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-card)] bg-primary/10 text-primary">
                  <Icon name={c.icon} size={20} />
                </span>
                <span className="text-[0.65rem] uppercase tracking-wider font-semibold text-muted">
                  {c.label}
                </span>
              </div>
              <p className="mt-4 font-display text-base font-medium text-ink">
                {c.value}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 border-t border-line pt-4 text-[0.7rem] font-medium">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="text-success">Verified Active Status</span>
            </div>
          </Reveal>
        ))}

        {/* Dynamic Addresses Card */}
        <Reveal
          delay={creds.length * 0.05}
          className="col-span-1 md:col-span-2 lg:col-span-3 rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-soft"
        >
          <h3 className="font-display text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <Icon name="map-pin" size={20} className="text-primary" />
            Registered & Manufacturing Addresses
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {company.addresses.map((addr) => (
              <div key={addr.label} className="rounded-[var(--radius-card)] bg-surface p-4 border border-line">
                <h4 className="font-display font-medium text-ink text-xs uppercase tracking-wider mb-2">{addr.label}</h4>
                <p className="text-xs text-ink-soft leading-relaxed">{addr.lines.join(' ')}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Info notice about Funding Readiness */}
      <Reveal delay={0.3} className="mt-8 rounded-[var(--radius-card)] bg-primary/5 border border-primary/20 p-4">
        <div className="flex gap-3">
          <Icon name="shield-check" size={24} className="text-primary shrink-0" />
          <div className="text-xs text-ink-soft">
            <span className="font-semibold text-primary text-sm block mb-1">MSME & Grant Readiness Note:</span> MR Print World Pvt. Ltd. maintains statutory compliance for all standard Indian enterprise mandates. Detailed certificates (GST Registration Certificate, PAN Card, MSME Udyam Certificate, MOA/AOA, and Audited Balance Sheets) are structured and available upon formal request under corporate non-disclosure agreements (NDAs).
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
