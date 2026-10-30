import type {
  BooleanFlag,
  MultivariantFlag,
  AttributeFlag,
} from '@/lib/feature-flags/crud-storage'

export type Tab = 'boolean' | 'multivariant' | 'attributes'

export type ModalMode =
  | { type: 'boolean'; editing: BooleanFlag | null }
  | { type: 'multivariant'; editing: MultivariantFlag | null }
  | { type: 'attributes'; editing: AttributeFlag | null }
  | null
