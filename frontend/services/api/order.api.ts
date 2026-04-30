export const orderApi = (api: any) => {
    return {
        async getOrder(id: number | string) {
            const {data} = await api(`/orders/${id}`)
            return data
        },

        async getOrders() {
            const {data} = await api('/api/orders')
            return data
        }
    }
}
