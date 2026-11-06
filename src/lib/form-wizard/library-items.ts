import type { LibraryItem } from "./types"

export const libraryItems: LibraryItem[] = [
  // Structure
  { type: "STEP", label: "Step", category: "structure", icon: "Layers" },

  // Content (typography basics)
  { type: "TITLE", label: "Title", category: "content", icon: "Type" },
  { type: "PARAGRAPH", label: "Paragraph", category: "content", icon: "AlignLeft" },

  // Presentation (docs-aligned blocks)
  { type: "WELCOME", label: "Welcome", category: "presentation", icon: "Sparkles" },
  { type: "ICON_CONTENT_LIST", label: "Icon Content List", category: "presentation", icon: "ListChecks" },
  { type: "RESUME", label: "Resume", category: "presentation", icon: "FileText" },
  { type: "PRICE_SIMULATION", label: "Price Simulation", category: "presentation", icon: "Wallet" },
  { type: "FCDC_PROPOSAL_SENT", label: "FCDC Proposal Sent", category: "presentation", icon: "SendHorizontal" },

  // Generic fields
  { type: "TEXT_INPUT", label: "Text Input", category: "fields", icon: "TextCursorInput" },
  { type: "SELECT", label: "Select", category: "fields", icon: "ChevronDown" },
  { type: "RADIO", label: "Radio", category: "fields", icon: "Circle" },
  { type: "CHECKBOX", label: "Checkbox", category: "fields", icon: "CheckSquare" },
  { type: "BIOLOGICAL_SEX", label: "Sexo biológico", category: "fields", icon: "Venus" },
  { type: "MARITAL_STATUS", label: "Estado civil", category: "fields", icon: "HeartHandshake" },
  { type: "NATIONALITY", label: "Nacionalidade", category: "fields", icon: "Globe" },
  { type: "OCCUPATION", label: "Ocupação", category: "fields", icon: "Briefcase" },
  { type: "MARKETING_OPTIN", label: "Marketing Opt-in", category: "fields", icon: "MailCheck" },

  // Special fields (legacy panel types)
  { type: "CPF_INPUT", label: "CPF", category: "special-fields", icon: "IdCard" },
  { type: "CNPJ_INPUT", label: "CNPJ", category: "special-fields", icon: "Building2" },
  { type: "SOCIAL_NAME_INPUT", label: "Nome Social", category: "special-fields", icon: "UserRound" },

  // Special fields (docs-aligned)
  { type: "TAXVAT_INPUT", label: "CPF (TAXVAT)", category: "special-fields", icon: "Fingerprint" },
  { type: "BIRTH_DATE_INPUT", label: "Data de nascimento", category: "special-fields", icon: "Calendar" },
  { type: "PLATE_INPUT", label: "Placa", category: "special-fields", icon: "Car" },
  { type: "CEP", label: "CEP (auto)", category: "special-fields", icon: "MapPinned" },
  { type: "SOCIAL_NAME", label: "Nome Social", category: "special-fields", icon: "UserSquare" },
  { type: "PHONE_INPUT", label: "Phone", category: "special-fields", icon: "Phone" },
  { type: "CEP_INPUT", label: "CEP", category: "special-fields", icon: "MapPin" },
  { type: "EMAIL_INPUT", label: "E-mail", category: "special-fields", icon: "Mail" },
  { type: "PRIVACY_POLICY", label: "Política de Privacidade", category: "special-fields", icon: "ShieldCheck" },

  // Plans
  { type: "PLANS", label: "Plans", category: "plans", icon: "CreditCard" },

  // Actions
  { type: "NAVIGATION", label: "Navigation", category: "actions", icon: "ExternalLink" },
  { type: "CONDITIONAL_ROUTE", label: "Conditional Route", category: "actions", icon: "GitFork" },
  { type: "SERVICE_CALL", label: "Service Call", category: "actions", icon: "Zap" },
]

export const categoryLabels: Record<string, string> = {
  structure: "Wizard Structure",
  content: "Content",
  presentation: "Presentation",
  fields: "Fields",
  "special-fields": "Special Fields",
  plans: "Plans",
  actions: "Actions",
}
