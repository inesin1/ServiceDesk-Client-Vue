import { defineStore } from 'pinia'

export const useUserStore = defineStore('user',  {
    state: () => ({
        /** @type {{ id: number, name: string, role: object, token: string }}*/
        user: {}
    }),
    getters: {
        getUser: (state) => state.user,
        isAuthenticated: (state) => state.user.id != null
    },
    actions: {
        setUser(user, token) {
            this.user = {
                id: user.id,
                name: user.name,
                role: user.role,
                token: token
            }
        },
        logout() {
            this.user = {};
        }
    }
})
