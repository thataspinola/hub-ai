import type { LibraryItem } from "./types"

export const libraryItems: LibraryItem[] = [
  { type: "STEP", label: "Step", category: "structure", icon: "Layers" },
  { type: "TITLE", label: "Title", category: "content", icon: "Type" },
  { type: "PARAGRAPH", label: "Paragraph", category: "content", icon: "AlignLeft" },
  { type: "TEXT_INPUT", label: "Text Input", category: "fields", icon: "TextCursorInput" },
  { type: "SELECT", label: "Select", category: "fields", icon: "ChevronDown" },
  { type: "RADIO", label: "Radio", category: "fields", icon: "Circle" },
  { type: "CHECKBOX", label: "Checkbox", category: "fields", icon: "CheckSquare" },
  { type: "CPF_INPUT", label: "CPF", category: "special-fields", icon: "IdCard" },
  { type: "CNPJ_INPUT", label: "CNPJ", category: "special-fields", icon: "Building2" },
  { type: "PHONE_INPUT", label: "Phone", category: "special-fields", icon: "Phone" },
  { type: "PLANS", label: "Plans", category: "plans", icon: "CreditCard" },
  { type: "NAVIGATION", label: "Navigation", category: "actions", icon: "ExternalLink" },
  { type: "CONDITIONAL_ROUTE", label: "Conditional Route", category: "actions", icon: "GitFork" },
  { type: "SERVICE_CALL", label: "Service Call", category: "actions", icon: "Zap" },
]

export const categoryLabels: Record<string, string> = {
  structure: "Wizard Structure",
  content: "Content",
  fields: "Fields",
  "special-fields": "Special Fields",
  plans: "Plans",
  actions: "Actions",
}
