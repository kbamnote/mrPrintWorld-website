/**
 * The print-trade field library.
 *
 * These are STARTING POINTS, not data: clicking one opens the new-option form
 * filled in, with every price left blank for you to set. Nothing reaches the
 * catalogue until you save it, and you can rename or remove any choice first.
 *
 * Every preset is a choice list (dropdown or radio), including the yes/no
 * ones. That is deliberate: only a choice can carry a price and be recorded
 * on the order for production, so a plain tick box would lose both.
 */

/** A choice. `priced: true` marks the ones that usually carry a surcharge. */
const v = (code, label, priced = false) => ({ code, label, deltaType: 'FLAT', priced })

export const PRESET_SECTIONS = ['Core print spec', 'Finishing', 'Service & delivery']

export const OPTION_PRESETS = [
  {
    section: 'Core print spec',
    code: 'PAPER_TYPE',
    label: 'Paper / card stock',
    helpText: 'The material it is printed on.',
    inputType: 'DROPDOWN',
    values: [
      v('ART_CARD', 'Art card'),
      v('MATTE_ART', 'Matte art paper'),
      v('GLOSS_ART', 'Gloss art paper'),
      v('MAPLITHO', 'Maplitho'),
      v('TEXTURED', 'Textured / handmade', true),
      v('KRAFT', 'Kraft', true),
      v('SYNTHETIC', 'Synthetic / PVC', true),
    ],
  },
  {
    section: 'Core print spec',
    code: 'PAPER_GSM',
    label: 'Thickness (GSM)',
    helpText: 'Heavier stock costs more.',
    inputType: 'DROPDOWN',
    values: [
      v('GSM_100', '100 gsm'),
      v('GSM_130', '130 gsm'),
      v('GSM_170', '170 gsm'),
      v('GSM_250', '250 gsm'),
      v('GSM_300', '300 gsm', true),
      v('GSM_350', '350 gsm', true),
      v('GSM_400', '400 gsm', true),
    ],
  },
  {
    section: 'Core print spec',
    code: 'PRINTING_SIDES',
    label: 'Printing sides',
    inputType: 'RADIO',
    values: [v('SINGLE', 'Single side'), v('BOTH', 'Both sides', true)],
  },
  {
    section: 'Core print spec',
    code: 'CARD_SIZE',
    label: 'Card size',
    helpText: 'Standard is 89 x 51 mm.',
    inputType: 'DROPDOWN',
    values: [
      v('STD_89X51', 'Standard - 89 x 51 mm (3.5 x 2 in)'),
      v('MINI_85X45', 'Mini - 85 x 45 mm'),
      v('SQUARE_55', 'Square - 55 x 55 mm', true),
      v('FOLDED', 'Folded card', true),
    ],
  },
  {
    section: 'Core print spec',
    code: 'PAPER_SIZE',
    label: 'Sheet size',
    inputType: 'DROPDOWN',
    values: [
      v('A3', 'A3 - 297 x 420 mm', true),
      v('A4', 'A4 - 210 x 297 mm'),
      v('A5', 'A5 - 148 x 210 mm'),
      v('A6', 'A6 - 105 x 148 mm'),
      v('DL', 'DL - 99 x 210 mm'),
      v('LEGAL', 'Legal - 216 x 356 mm', true),
    ],
  },
  {
    section: 'Core print spec',
    code: 'ORIENTATION',
    label: 'Orientation',
    inputType: 'RADIO',
    values: [v('PORTRAIT', 'Portrait'), v('LANDSCAPE', 'Landscape')],
  },
  {
    section: 'Core print spec',
    code: 'COLOUR_MODE',
    label: 'Colour',
    inputType: 'RADIO',
    values: [
      v('CMYK', 'Full colour (CMYK)'),
      v('BLACK', 'Single colour - black'),
      v('TWO_COLOUR', 'Two colour'),
    ],
  },
  {
    section: 'Finishing',
    code: 'CORNER_STYLE',
    label: 'Corners',
    inputType: 'RADIO',
    values: [v('SQUARE', 'Square corners'), v('ROUNDED', 'Rounded corners', true)],
  },
  {
    section: 'Finishing',
    code: 'CORNER_RADIUS',
    label: 'Corner radius',
    helpText: 'Ask this only on products where rounded corners are offered.',
    inputType: 'DROPDOWN',
    values: [v('R2', '2 mm'), v('R3', '3 mm'), v('R5', '5 mm')],
  },
  {
    section: 'Finishing',
    code: 'CUTTING_STYLE',
    label: 'Cutting',
    helpText: 'Flush cut prints right to the edge; a white border leaves an unprinted margin.',
    inputType: 'RADIO',
    values: [v('FLUSH', 'Flush cut - printed to the edge', true), v('WHITE_BORDER', 'White border')],
  },
  {
    section: 'Finishing',
    code: 'LAMINATION',
    label: 'Lamination',
    inputType: 'DROPDOWN',
    values: [
      v('NONE', 'None'),
      v('MATTE', 'Matte', true),
      v('GLOSS', 'Gloss', true),
      v('VELVET', 'Velvet / soft touch', true),
    ],
  },
  {
    section: 'Finishing',
    code: 'LAMINATION_SIDES',
    label: 'Lamination sides',
    inputType: 'RADIO',
    values: [v('SINGLE', 'One side'), v('BOTH', 'Both sides', true)],
  },
  {
    section: 'Finishing',
    code: 'SPOT_UV',
    label: 'Spot UV',
    helpText: 'Raised gloss on selected areas of the design.',
    inputType: 'RADIO',
    values: [v('NO', 'No spot UV'), v('YES', 'Spot UV', true)],
  },
  {
    section: 'Finishing',
    code: 'FOILING',
    label: 'Foil stamping',
    inputType: 'DROPDOWN',
    values: [
      v('NONE', 'None'),
      v('GOLD', 'Gold foil', true),
      v('SILVER', 'Silver foil', true),
      v('ROSE_GOLD', 'Rose gold foil', true),
      v('COPPER', 'Copper foil', true),
    ],
  },
  {
    section: 'Finishing',
    code: 'EMBOSSING',
    label: 'Embossing',
    inputType: 'DROPDOWN',
    values: [v('NONE', 'None'), v('EMBOSS', 'Raised (emboss)', true), v('DEBOSS', 'Recessed (deboss)', true)],
  },
  {
    section: 'Finishing',
    code: 'EDGE_PAINTING',
    label: 'Edge painting',
    inputType: 'DROPDOWN',
    values: [
      v('NONE', 'None'),
      v('GOLD', 'Gold edge', true),
      v('SILVER', 'Silver edge', true),
      v('BLACK', 'Black edge', true),
    ],
  },
  {
    section: 'Finishing',
    code: 'DIE_CUTTING',
    label: 'Die cutting',
    helpText: 'A custom shape cut with a die.',
    inputType: 'RADIO',
    values: [v('NO', 'Standard shape'), v('YES', 'Custom die-cut shape', true)],
  },
  {
    section: 'Finishing',
    code: 'PERFORATION',
    label: 'Perforation',
    inputType: 'RADIO',
    values: [v('NO', 'None'), v('YES', 'Perforated', true)],
  },
  {
    section: 'Finishing',
    code: 'NUMBERING',
    label: 'Serial numbering',
    helpText: 'Sequential numbers - bill books, receipts, coupons.',
    inputType: 'RADIO',
    values: [v('NO', 'No numbering'), v('YES', 'Numbered', true)],
  },
  {
    section: 'Finishing',
    code: 'BINDING',
    label: 'Binding',
    inputType: 'DROPDOWN',
    values: [
      v('NONE', 'Loose sheets'),
      v('GUM_PAD', 'Gum padded', true),
      v('STAPLED', 'Centre stapled', true),
      v('SPIRAL', 'Spiral', true),
      v('WIRO', 'Wiro', true),
      v('PERFECT', 'Perfect bound', true),
    ],
  },
  {
    section: 'Finishing',
    code: 'COPIES_PER_SET',
    label: 'Copies per set',
    helpText: 'Carbonless books - original plus copies.',
    inputType: 'DROPDOWN',
    values: [v('PLY_1', 'Single copy'), v('PLY_2', 'Two copies', true), v('PLY_3', 'Three copies', true)],
  },
  {
    section: 'Service & delivery',
    code: 'ARTWORK',
    label: 'Artwork',
    helpText: 'Whether the customer supplies the design or we make it.',
    inputType: 'RADIO',
    values: [v('UPLOAD', 'I will send my own artwork'), v('DESIGN_FOR_ME', 'Design it for me', true)],
  },
  {
    section: 'Service & delivery',
    code: 'PROOF_APPROVAL',
    label: 'Proof before printing',
    inputType: 'RADIO',
    values: [v('NO', 'Print straight away'), v('YES', 'Send me a proof to approve')],
  },
  {
    section: 'Service & delivery',
    code: 'DELIVERY_SPEED',
    label: 'Delivery speed',
    inputType: 'RADIO',
    values: [v('STANDARD', 'Standard'), v('EXPRESS', 'Express', true), v('SAME_DAY', 'Same day', true)],
  },
  {
    section: 'Service & delivery',
    code: 'PACKING',
    label: 'Packing',
    inputType: 'DROPDOWN',
    values: [
      v('STANDARD', 'Standard packing'),
      v('SHRINK_WRAP', 'Shrink wrapped', true),
      v('GIFT_BOX', 'Gift box', true),
    ],
  },
]
