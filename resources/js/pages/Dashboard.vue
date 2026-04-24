<script setup>

import {onMounted, computed} from 'vue'
import {useAuthStore} from '@/stores/authStore'
import {useDashboardStore} from '@/stores/dashboardStore'

const auth = useAuthStore()
const dashboard = useDashboardStore()

const user = computed(() => auth.user)
const isApiUser = computed(() => auth.user?.role === 'api')
//const isUserLoaded = computed(() => auth.initialized)

onMounted(async () => {
    if (!auth.initialized) {
        await auth.initAuth()
    }
    await dashboard.fetchDashboard()
})

</script>

<template>
    <div class="container mt-4">

        <h1 class="mb-3">Панель управления</h1>

        <div v-if="dashboard.loading">Загрузка...</div>

        <template v-else>
            <p class="mb-4">
                Добро пожаловать, {{ user?.email || 'пользователь' }}
            </p>

            <div class="mb-4 d-flex gap-2 flex-wrap">
                <router-link
                    v-if="isApiUser"
                    to="/dashboard/car/create"
                    class="btn btn-primary"
                >
                    Добавить авто
                </router-link>

                <router-link
                    to="/dashboard/profile"
                    class="btn btn-outline-secondary"
                >
                    Профиль
                </router-link>
            </div>

            <!-- GRID -->
            <div class="row">
                <div class="col-12 col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5>Мой профиль</h5>
                            <p class="mb-0">{{ user?.name || 'User' }}</p>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5>Статус</h5>
                            <p class="mb-0 text-success">Active</p>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5>Мои машины</h5>
                            <p class="mb-0">{{ dashboard.carsCount }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </template>

    </div>
</template>
