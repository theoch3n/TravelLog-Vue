<template>
    <v-container class="bg-grey-lighten-4 min-h-screen py-6">
        <!-- Progress Stepper -->
        <v-stepper :items="['選擇方案', '填寫資料', '完成付款']" :model-value="2" class="mb-6 bg-transparent elevation-0">
            <template v-slot:item.icon="{ index }">
                <div class="rounded-circle" :class="index <= 1 ? 'bg-orange' : 'bg-grey'"
                    style="width: 16px; height: 16px;"></div>
            </template>
            <template v-slot:item.title="{ title, index }">
                <span :class="index <= 1 ? 'text-orange' : 'text-grey'">{{ title }}</span>
            </template>
        </v-stepper>

        <v-row>
            <!-- Main Form -->
            <v-col cols="12" md="8">
                <!-- Booking Details -->
                <v-card class="mb-6">
                    <v-card-item>
                        <div class="d-flex gap-4">
                            <v-img src="" width="80" height="80" cover class="rounded-lg"></v-img>
                            <div>
                                <v-card-title class="text-body-1 font-weight-bold pa-0 mb-1">
                                    羅東夜市第一日遊（含羅東和連山公路）
                                </v-card-title>
                                <v-card-subtitle class="pa-0">
                                    羅東市區～日遊
                                </v-card-subtitle>
                            </div>
                        </div>
                    </v-card-item>

                    <v-card-text>
                        <h3 class="text-h6 font-weight-bold mb-4">參加人資料</h3>
                        <div class="d-flex gap-2 mb-6">
                            <v-btn variant="outlined" size="small">會員</v-btn>
                            <v-btn variant="outlined" size="small">旅客</v-btn>
                            <v-btn variant="outlined" size="small" color="orange">
                                <v-icon start>mdi-plus</v-icon>
                                新增
                            </v-btn>
                        </div>

                        <v-select label="其他用戶資訊" placeholder="請選擇" variant="outlined" density="comfortable"
                            class="mb-4"></v-select>

                        <v-select label="您會帶寵物或導盲犬嗎？" placeholder="請選擇" variant="outlined"
                            density="comfortable"></v-select>
                    </v-card-text>
                </v-card>

                <!-- Contact Info -->
                <v-card class="mb-6">
                    <v-card-text>
                        <h3 class="text-h6 font-weight-bold mb-4">聯絡資料</h3>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field label="姓名" variant="outlined" density="comfortable"
                                    model-value="Chen"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="名字" variant="outlined" density="comfortable"
                                    model-value="TaiZhi"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-text-field label="電話號碼" variant="outlined" density="comfortable" model-value="886-905863313"
                            class="mb-4"></v-text-field>
                        <v-text-field label="電子郵箱（旅遊行程將寄送於此）" variant="outlined" density="comfortable"
                            model-value="abc1234@gmail.com"></v-text-field>
                    </v-card-text>
                </v-card>

                <!-- Insurance -->
                <v-card class="mb-6">
                    <v-card-text>
                        <h3 class="text-h6 font-weight-bold mb-4">升級</h3>
                        <v-alert color="orange" variant="tonal" class="mb-4">
                            <div class="d-flex align-center gap-2">
                                <v-icon icon="mdi-heart" color="orange"></v-icon>
                                <span class="font-weight-medium">有買有保障，出遊更安心！</span>
                            </div>
                        </v-alert>

                        <v-checkbox label="未購買旅遊險" density="comfortable">
                            <template v-slot:message>
                                <span class="text-grey">建議投保</span>
                            </template>
                        </v-checkbox>

                        <v-checkbox label="不需加購保險服務" density="comfortable"></v-checkbox>
                    </v-card-text>
                </v-card>

                <v-btn block color="orange" size="large" class="mb-6">
                    前往付款
                </v-btn>
            </v-col>

            <!-- Price Summary -->
            <v-col cols="12" md="4">
                <v-card class="mb-6">
                    <v-card-text>
                        <h3 class="text-h6 font-weight-bold mb-4">價格資料</h3>
                        <div class="d-flex justify-space-between mb-4">
                            <span>成人 x 1</span>
                            <span>NT$ 1,520</span>
                        </div>
                        <div class="d-flex justify-space-between mb-4 text-grey">
                            <span>服務平台手續費</span>
                            <span>NT$ 1,015</span>
                        </div>
                        <v-divider class="mb-4"></v-divider>
                        <div class="d-flex justify-space-between font-weight-bold">
                            <span>付款下一步</span>
                            <span>NT$ 1,613</span>
                        </div>
                    </v-card-text>
                </v-card>

                <v-alert color="green" variant="tonal" class="mb-6">
                    <p class="text-body-2">
                        再加 NT$ 60 Klook 幣回饋！<br>
                        下次消費使用回饋幣更超值！
                    </p>
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
// Component logic can be added here if needed
</script>

<style scoped>
/* Custom styles */
:deep(.v-stepper) {
    --v-theme-primary: rgb(255, 87, 34);
}

:deep(.v-btn) {
    text-transform: none;
}

:deep(.v-alert) {
    --v-theme-orange: rgb(255, 87, 34);
}
</style>