import type { RecommendationStore } from '../store-types'
import type { RecommendationActionContext } from './types'

export function createCatalogActions({
  set,
  saveChange,
}: RecommendationActionContext): Pick<
  RecommendationStore,
  | 'addProduct'
  | 'updateProduct'
  | 'deleteProduct'
  | 'addCategory'
  | 'deleteCategory'
> {
  return {
    addProduct: (product) =>
      set((state) => {
        const newCategories = state.data.catalog.categories.includes(
          product.category,
        )
          ? state.data.catalog.categories
          : [...state.data.catalog.categories, product.category]

        const newData = {
          ...state.data,
          catalog: {
            products: [...state.data.catalog.products, product],
            categories: newCategories,
          },
        }

        saveChange(newData)

        return { data: newData, isDirty: true }
      }),

    updateProduct: (url, product) =>
      set((state) => {
        const newData = {
          ...state.data,
          catalog: {
            ...state.data.catalog,
            products: state.data.catalog.products.map((p) =>
              p.url === url ? product : p,
            ),
          },
        }

        saveChange(newData)

        return { data: newData, isDirty: true }
      }),

    deleteProduct: (url) =>
      set((state) => {
        const newData = {
          ...state.data,
          catalog: {
            ...state.data.catalog,
            products: state.data.catalog.products.filter((p) => p.url !== url),
          },
        }

        saveChange(newData)

        return { data: newData, isDirty: true }
      }),

    addCategory: (category) =>
      set((state) => {
        const newData = {
          ...state.data,
          catalog: {
            ...state.data.catalog,
            categories: [...state.data.catalog.categories, category],
          },
        }

        saveChange(newData)

        return { data: newData, isDirty: true }
      }),

    deleteCategory: (category) =>
      set((state) => {
        const newData = {
          ...state.data,
          catalog: {
            ...state.data.catalog,
            categories: state.data.catalog.categories.filter(
              (c) => c !== category,
            ),
          },
        }

        saveChange(newData)

        return { data: newData, isDirty: true }
      }),
  }
}
