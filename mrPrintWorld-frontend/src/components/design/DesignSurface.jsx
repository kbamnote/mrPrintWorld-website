import { createElement } from 'react'
import CardMeridian from './CardMeridian'
import CardStudio from './CardStudio'
import CardMonogram from './CardMonogram'
import LeafletA5 from './LeafletA5'
import LeafletDL from './LeafletDL'

/**
 * Template id to drawing. Adding a design means one component here and one
 * entry in src/data/designTemplates.js — nothing else in the app changes.
 */
const DESIGNS = {
  meridian: CardMeridian,
  studio: CardStudio,
  monogram: CardMonogram,
  'offer-a5': LeafletA5,
  'services-dl': LeafletDL,
}


/** Draws one template. Everything else is passed straight through to it. */
export default function DesignSurface({ id, ...props }) {
  const design = DESIGNS[id]
  return design ? createElement(design, props) : null
}
