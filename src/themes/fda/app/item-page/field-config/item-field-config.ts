export interface FieldConfig {
field: string;
labelKey: string;
type: 'text' | 'uri' | 'date' | 'authors';
separator?: string;
}

export interface CollectionConfig {
handles: string[];
fields: FieldConfig[];
i18nPrefix?: string;
}

// ============================================
// DEFAULT FIELDS
// ============================================
const DEFAULT_FIELDS: FieldConfig[] = [
  { field: 'dc.title', labelKey: 'item.page.title', type: 'text' },
  { field: 'dc.title.alternative', labelKey: 'item.page.title.alternative', type: 'text' },
  { field: 'dc.contributor.author,dc.contributor,dc.creator', labelKey: 'item.page.contributor.*', type: 'authors' },
  { field: 'dc.subject', labelKey: 'item.page.subject', type: 'text', separator: '; ' },
  { field: 'dc.date.issued', labelKey: 'item.page.date.issued', type: 'date' },
  { field: 'dc.publisher', labelKey: 'item.page.publisher', type: 'text' },
  { field: 'dc.identifier.citation', labelKey: 'item.page.citation', type: 'uri' },
  { field: 'dc.relation.ispartofseries', labelKey: 'item.page.relation.ispartofseries', type: 'text' },
  { field: 'dc.description.abstract', labelKey: 'item.page.abstract', type: 'text' },
  { field: 'dc.description', labelKey: 'item.page.description', type: 'text' },
  { field: 'dc.identifier.govdoc', labelKey: 'item.page.identifier.govdoc', type: 'text' },
  { field: 'dc.identifier.uri', labelKey: 'item.page.uri', type: 'uri' },
  { field: 'dc.identifier.isbn', labelKey: 'item.page.isbn', type: 'text' },
  { field: 'dc.identifier.issn', labelKey: 'item.page.issn', type: 'text' },
  { field: 'dc.identifier.DOI', labelKey: 'item.page.doi', type: 'uri' },
  { field: 'dc.identifier.ismn', labelKey: 'item.page.ismn', type: 'text' },
  { field: 'dc.identifier', labelKey: 'item.page.identifier', type: 'text' },
  { field: 'dc.rights', labelKey: 'item.page.rights', type: 'text' },
];

// ============================================
// JONES COLLECTION FIELDS
// ============================================
const JONES_FIELDS: FieldConfig[] = [
  { field: 'dc.title', labelKey: 'item.page.title', type: 'text' },
  { field: 'dc.contributor.author,dc.contributor', labelKey: 'item.page.contributor.*', type: 'authors' },
  { field: 'dc.subject', labelKey: 'item.page.subject', type: 'text', separator: '; ' },
  { field: 'dc.date.issued', labelKey: 'item.page.date.issued', type: 'date' },
  { field: 'dc.date.created', labelKey: 'item.page.date.created', type: 'date' },
  { field: 'dc.identifier.other', labelKey: 'item.page.identifier.other', type: 'text' },
  { field: 'dc.language.iso', labelKey: 'item.page.language.iso', type: 'text' },
  { field: 'dc.description', labelKey: 'item.page.description', type: 'text' },
  { field: 'dc.format.mimetype', labelKey: 'item.page.format.mimetype', type: 'text' },
  { field: 'dc.description.equipment', labelKey: 'item.page.description.equipment', type: 'text' },
  { field: 'dc.description.additional', labelKey: 'item.page.description.additional', type: 'text' },
  { field: 'dc.relation.isreferencedby', labelKey: 'item.page.relation.isreferencedby', type: 'text' },
  { field: 'dc.relation.uri', labelKey: 'item.page.relation.uri', type: 'uri' },
  { field: 'dc.rights', labelKey: 'item.page.rights', type: 'text' },
];

// ============================================
// RELICS COLLECTION FIELDS
// ============================================
const RELICS_FIELDS: FieldConfig[] = [
  { field: 'dc.title', labelKey: 'item.page.title', type: 'text' },
  { field: 'dc.contributor.author,dc.contributor', labelKey: 'item.page.contributor.*', type: 'authors' },
  { field: 'dc.date.issued', labelKey: 'item.page.date.issued', type: 'date' },
  { field: 'dc.publisher', labelKey: 'item.page.publisher', type: 'text' },
  { field: 'dc.identifier.other', labelKey: 'item.page.identifier.other', type: 'text' },
  { field: 'dc.language.iso', labelKey: 'item.page.language.iso', type: 'text' },
  { field: 'dc.type', labelKey: 'item.page.type', type: 'text' },
  { field: 'dc.description', labelKey: 'item.page.description', type: 'text' },
  { field: 'dc.coverage.spatial', labelKey: 'item.page.coverage.spatial', type: 'text' },
  { field: 'dc.source', labelKey: 'item.page.source', type: 'text' },
  { field: 'dc.rights', labelKey: 'item.page.rights', type: 'text' },
];

// ============================================
// LAEFER COLLECTION FIELDS
// ============================================
const LAEFER_FIELDS: FieldConfig[] = [
  { field: 'dc.title', labelKey: 'item.page.title', type: 'text' },
  { field: 'dc.title.alternative', labelKey: 'item.page.title.alternative', type: 'text' },
  { field: 'dc.contributor.author,dc.contributor', labelKey: 'item.page.contributor.*', type: 'authors' },
  { field: 'dc.subject', labelKey: 'item.page.subject', type: 'text', separator: '; ' },
  { field: 'dc.date.issued', labelKey: 'item.page.date.issued', type: 'date' },
  { field: 'dc.publisher', labelKey: 'item.page.publisher', type: 'text' },
  { field: 'dc.identifier.citation', labelKey: 'item.page.citation', type: 'text' },
  { field: 'dc.relation.ispartofseries', labelKey: 'item.page.relation.ispartofseries', type: 'text' },
  { field: 'dc.description.abstract', labelKey: 'item.page.abstract', type: 'text' },
  { field: 'dc.description', labelKey: 'item.page.description', type: 'text' },
  { field: 'dc.identifier.govdoc', labelKey: 'item.page.identifier.govdoc', type: 'text' },
  { field: 'dc.identifier.uri', labelKey: 'item.page.uri', type: 'uri' },
  { field: 'dc.identifier.isbn', labelKey: 'item.page.isbn', type: 'text' },
  { field: 'dc.identifier.issn', labelKey: 'item.page.issn', type: 'text' },
  { field: 'dc.identifier.ismn', labelKey: 'item.page.ismn', type: 'text' },
  { field: 'dc.identifier', labelKey: 'item.page.identifier', type: 'text' },
  { field: 'dc.rights', labelKey: 'item.page.rights', type: 'text' },
];

// ============================================
// TANDON COLLECTION FIELDS
// ============================================
const TANDON_FIELDS: FieldConfig[] = [
  { field: 'dc.title', labelKey: 'item.page.title', type: 'text' },
  { field: 'dc.title.alternative', labelKey: 'item.page.title.alternative', type: 'text' },
  { field: 'dc.contributor.author,dc.contributor', labelKey: 'item.page.contributor.*', type: 'authors' },
  { field: 'dc.date.issued', labelKey: 'item.page.date.issued', type: 'date' },
  { field: 'dc.identifier.citation', labelKey: 'item.page.citation', type: 'text' },
  { field: 'dc.description.abstract', labelKey: 'item.page.abstract', type: 'text' },
  { field: 'dc.description.firstPage', labelKey: 'item.page.description.firstPage', type: 'text' },
  { field: 'dc.description.lastPage', labelKey: 'item.page.description.lastPage', type: 'text' },
  { field: 'dc.identifier.DOI', labelKey: 'item.page.doi', type: 'uri' },
  { field: 'dc.type', labelKey: 'item.page.type', type: 'text' },
];

// ============================================
// TANDON CAPSTONE COLLECTION FIELDS
// ============================================
const TANDONCAPSTONE_FIELDS: FieldConfig[] = [
  { field: 'dc.title', labelKey: 'item.page.title', type: 'text' },
  { field: 'dc.contributor.author', labelKey: 'item.page.contributor.author', type: 'authors' },
  { field: 'dc.contributor.advisor', labelKey: 'item.page.contributor.advisor', type: 'authors' },
  { field: 'dc.date.issued', labelKey: 'item.page.date.issued', type: 'date' },
  { field: 'dc.description.abstract', labelKey: 'item.page.abstract', type: 'text' },
  { field: 'dc.identifier.URI', labelKey: 'item.page.uri', type: 'uri' },
  { field: 'dc.type', labelKey: 'item.page.type', type: 'text' },
];

// ============================================
// DNP COLLECTION FIELDS
// ============================================
const DNP_FIELDS: FieldConfig[] = [
  { field: 'dc.title', labelKey: 'item.page.title', type: 'text' },
  { field: 'dc.title.alternative', labelKey: 'item.page.title.alternative', type: 'text' },
  { field: 'dc.description.abstract', labelKey: 'item.page.abstract', type: 'text' },
  { field: 'dc.contributor.author', labelKey: 'item.page.contributor.author', type: 'authors' },
  { field: 'dc.contributor.advisor', labelKey: 'item.page.contributor.advisor', type: 'authors' },
  { field: 'dc.description', labelKey: 'item.page.description', type: 'text' },
  { field: 'thesis.degree.name', labelKey: 'item.page.thesis.degree.name', type: 'text' },
  { field: 'thesis.degree.level', labelKey: 'item.page.thesis.degree.level', type: 'text' },
  { field: 'thesis.degree.discipline', labelKey: 'item.page.thesis.degree.discipline', type: 'text' },
  { field: 'dc.date.issued', labelKey: 'item.page.date.issued', type: 'date' },
  { field: 'thesis.degree.grantor', labelKey: 'item.page.thesis.degree.grantor', type: 'text' },
  { field: 'dc.language.iso', labelKey: 'item.page.language.iso', type: 'text' },
  { field: 'dc.subject.mesh', labelKey: 'item.page.subject.mesh', type: 'text', separator: '; ' },
  { field: 'dc.subject.cinahl', labelKey: 'item.page.subject.cinahl', type: 'text', separator: '; ' },
  { field: 'dc.subject.apa', labelKey: 'item.page.subject.apa', type: 'text', separator: '; ' },
  { field: 'dc.subject', labelKey: 'item.page.subject', type: 'text', separator: '; ' },
  { field: 'dc.type', labelKey: 'item.page.type', type: 'text' },
  { field: 'dc.format.medium', labelKey: 'item.page.format.medium', type: 'text' },
  { field: 'dc.description.sponsorship', labelKey: 'item.page.description.sponsorship', type: 'text' },
  { field: 'dc.identifier.uri', labelKey: 'item.page.uri', type: 'uri' },
  { field: 'dc.rights', labelKey: 'item.page.rights', type: 'text' },
];

// ============================================
// CALABASH COLLECTION FIELDS
// ============================================
const CALABASH_FIELDS: FieldConfig[] = [
  { field: 'dc.title', labelKey: 'item.page.title', type: 'text' },
  { field: 'dc.title.alternative', labelKey: 'item.page.title.alternative', type: 'text' },
  { field: 'dc.contributor.author', labelKey: 'item.page.contributor.author', type: 'authors' },
  { field: 'dc.contributor.translator', labelKey: 'item.page.contributor.translator', type: 'authors' },
  { field: 'dc.subject', labelKey: 'item.page.subject', type: 'text', separator: '; ' },
  { field: 'dc.date.issued', labelKey: 'item.page.date.issued', type: 'date' },
  { field: 'dc.publisher', labelKey: 'item.page.publisher', type: 'text' },
  { field: 'dc.identifier.citation', labelKey: 'item.page.citation', type: 'text' },
  { field: 'dc.identifier.DOI', labelKey: 'item.page.doi', type: 'uri' },
  { field: 'dc.description.abstract', labelKey: 'item.page.abstract', type: 'text' },
  { field: 'dc.description', labelKey: 'item.page.description', type: 'text' },
  { field: 'dc.identifier.uri', labelKey: 'item.page.uri', type: 'uri' },
  { field: 'dc.identifier.issn', labelKey: 'item.page.issn', type: 'text' },
  { field: 'dc.rights', labelKey: 'item.page.rights', type: 'text' },
  { field: 'prism.publicationName', labelKey: 'item.page.prism.publicationName', type: 'text' },
  { field: 'prism.issueIdentifier', labelKey: 'item.page.prism.issueIdentifier', type: 'text' },
  { field: 'prism.volume', labelKey: 'item.page.prism.volume', type: 'text' },
  { field: 'prism.startingPage', labelKey: 'item.page.prism.startingPage', type: 'text' },
  { field: 'prism.endingPage', labelKey: 'item.page.prism.endingPage', type: 'text' },
];

// ============================================
// OPENSCHOLARSHIP COLLECTION FIELDS
// ============================================
const OPENSCHOLARSHIP_FIELDS: FieldConfig[] = [
  { field: 'dc.title', labelKey: 'item.page.title', type: 'text' },
  { field: 'dc.contributor.author', labelKey: 'item.page.contributor.author', type: 'authors' },
  { field: 'dc.date.issued', labelKey: 'item.page.date.issued', type: 'date' },
  { field: 'dc.description.abstract', labelKey: 'item.page.abstract', type: 'text' },
  { field: 'dc.description.sponsorship', labelKey: 'item.page.description.sponsorship', type: 'text' },
  { field: 'dc.identifier.DOI', labelKey: 'item.page.doi', type: 'text' },
  { field: 'dc.rights', labelKey: 'item.page.rights', type: 'text' },
  { field: 'dc.subject', labelKey: 'item.page.subject', type: 'text', separator: '; ' },
];

// ============================================
// SYLLABI COLLECTION FIELDS
// ============================================
const SYLLABI_FIELDS: FieldConfig[] = [
  { field: 'dc.title', labelKey: 'item.page.title', type: 'text' },
  { field: 'dc.contributor.instructor', labelKey: 'item.page.contributor.instructor', type: 'authors' },
  { field: 'dc.date.issued', labelKey: 'item.page.date.issued', type: 'date' },
  { field: 'dc.description.abstract', labelKey: 'item.page.abstract', type: 'text' },
  { field: 'dc.identifier.coursenumber', labelKey: 'item.page.identifier.coursenumber', type: 'text' },
  { field: 'dc.description.semester', labelKey: 'item.page.description.semester', type: 'text' },
  { field: 'dc.rights', labelKey: 'item.page.rights', type: 'text' },
];

// ============================================
// COLLECTION CONFIGURATIONS
// ============================================
export const COLLECTION_CONFIGS: CollectionConfig[] = [
  {
    handles: ['2451/44191', '2451/44193', '2451/44466'],
    fields: JONES_FIELDS,
    i18nPrefix: 'jones',
  },
  {
    handles: ['2451/44428'],
    fields: RELICS_FIELDS,
    i18nPrefix: 'relics',
  },
  {
    handles: ['2451/37860', '2451/42280'],
    fields: LAEFER_FIELDS,
    i18nPrefix: 'laefer',
  },
  {
    handles: ['2451/60387'],
    fields: TANDON_FIELDS,
    i18nPrefix: 'tandon',
  },
  {
    handles: ['2451/62790', '2451/62791'],
    fields: TANDONCAPSTONE_FIELDS,
    i18nPrefix: 'tandoncapstone',
  },
  {
    handles: ['2451/62822'],
    fields: DNP_FIELDS,
    i18nPrefix: 'dnp',
  },
  {
    handles: ['2451/62242', '2451/62243', '2451/62244', '2451/62245', '2451/62246', '2451/62247', '2451/62248', '2451/62249', '2451/62250'],
    fields: CALABASH_FIELDS,
    i18nPrefix: 'calabash',
  },
  {
    handles: ['2451/63332'],
    fields: OPENSCHOLARSHIP_FIELDS,
    i18nPrefix: 'openscholarship',
  },
  {
    handles: ['2451/34841'],
    fields: SYLLABI_FIELDS,
    i18nPrefix: 'syllabi',
  },
];

export const DEFAULT_CONFIG: CollectionConfig = {
  handles: [],
  fields: DEFAULT_FIELDS,
  i18nPrefix: '',
};

export function getConfigForCollection(handle: string): CollectionConfig {
  const config = COLLECTION_CONFIGS.find(c => c.handles.includes(handle));
  return config || DEFAULT_CONFIG;
}
