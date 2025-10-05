import { create } from 'zustand'
import { createCategory, getCategories } from '../api/categories'

type CategoriesStore = {
	categories: { id: string; name: string; type: 'доход' | 'расход' }[]

	fetchCategories: () => void
	createCategory: (name: string, type: 'доход' | 'расход') => void
}

export const useCategoriesStore = create<CategoriesStore>(set => ({
	categories: [],
	fetchCategories: async () => {
		const data = await getCategories()
		set({ categories: data })
	},

	createCategory: async (name, type) => {
		await createCategory(name, type).then(() => {
			getCategories().then(data => set({ categories: data }))
		})
	}
}))
