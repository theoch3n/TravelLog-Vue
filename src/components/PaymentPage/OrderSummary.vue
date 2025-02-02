<script setup>
</script>
<template>
  <v-card>
    <v-card-title>訂單摘要</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-title>行程名稱</v-list-item-title>
          <v-list-item-subtitle>台北一日遊</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>日期</v-list-item-title>
          <v-list-item-subtitle>2024-02-15</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>人數</v-list-item-title>
          <v-list-item-subtitle>2 人</v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-divider class="my-4"></v-divider>
      <v-row>
        <v-col cols="6">小計</v-col>
        <v-col cols="6" class="text-right">NT$ 2,400</v-col>
        <v-col cols="6">折扣</v-col>
        <v-col cols="6" class="text-right">-NT$ 200</v-col>
        <v-col cols="6" class="font-weight-bold">總計</v-col>
        <v-col cols="6" class="text-right font-weight-bold">NT$ 2,200</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<style scoped></style>