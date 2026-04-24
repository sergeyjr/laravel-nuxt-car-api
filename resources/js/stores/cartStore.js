import {defineStore} from "pinia";
import axios from "axios";

function cleanItems(obj) {
    return Object.fromEntries(
        Object.entries(obj || {}).filter(([_, item]) => item != null)
    );
}

export const useCartStore = defineStore("cart", {
    state: () => {
        const raw = JSON.parse(localStorage.getItem('cartItems')) || {}

        return {
            items: cleanItems(raw),
            initialized: false
        }
    },

    getters: {
        total: (state) =>
            Object.values(state.items).reduce((sum, item) => {
                if (!item) return sum
                return sum + Number(item.price) * Number(item.qty)
            }, 0)
    },

    actions: {
        saveToLocalStorage() {
            localStorage.setItem('cartItems', JSON.stringify(this.items));
        },

        async fetch(force = false) {
            try {
                if (this.initialized) return

                // если уже есть данные — не грузим повторно
                if (!force && Object.keys(this.items).length > 0) {
                    return
                }

                const res = await axios.get("/api/cart")
                const serverItems = cleanItems(res.data)

                // если сервер пустой — не затираем
                if (Object.keys(serverItems).length > 0) {
                    this.items = serverItems
                    this.saveToLocalStorage()
                }

            } catch (error) {
                console.error("Ошибка загрузки корзины:", error)
            } finally {
                this.initialized = true
            }
        },

        async add(newItem) {
            try {
                await axios.post("/api/cart/add", newItem);

                if (this.items[newItem.id]) {
                    this.items[newItem.id].qty += newItem.qty ?? 1
                } else {
                    this.items[newItem.id] = {
                        id: newItem.id,
                        name: newItem.name,
                        price: newItem.price,
                        qty: newItem.qty ?? 1,
                        photo_url: newItem.photo_url || null
                    }
                }

                this.saveToLocalStorage();
            } catch (error) {
                console.error("Ошибка добавления в корзину:", error);
            }
        },

        async update(id, qty) {
            try {
                await axios.post("/api/cart/update", {id, qty});

                if (this.items[id]) {
                    this.items[id].qty = qty;
                    this.saveToLocalStorage();
                }
            } catch (error) {
                console.error("Ошибка обновления корзины:", error);
            }
        },

        async remove(id) {
            try {
                await axios.post("/api/cart/remove", {id});

                delete this.items[id];
                this.saveToLocalStorage();
            } catch (error) {
                console.error("Ошибка удаления из корзины:", error);
            }
        },

        async clear() {
            try {
                await axios.post("/api/cart/clear");

                this.items = {};
                this.saveToLocalStorage();
            } catch (error) {
                console.error("Ошибка очистки корзины:", error);
            }
        }
    }
});
