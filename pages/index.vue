
<template>
      <!-- Dashboard Content -->
      <main class="flex-1 p-6 space-y-6">
        <!-- Stat Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <v-card class="p-4 flex flex-col items-start">
            <div class="text-gray-500">총 사용자</div>
            <div class="text-2xl font-bold">1,245</div>
          </v-card>
          <v-card class="p-4 flex flex-col items-start">
            <div class="text-gray-500">오늘 방문</div>
            <div class="text-2xl font-bold">87</div>
          </v-card>
        </div>

        <!-- Recent Activity Table -->
        <div class="bg-white rounded-lg shadow p-4">
          <div class="font-semibold mb-2">최근 활동</div>
          <v-table>
            <thead>
              <tr>
                <th>날짜</th>
                <th>사용자</th>
                <th>활동</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-08-16</td>
                <td>홍길동</td>
                <td>게시글 작성</td>
              </tr>
              <tr>
                <td>2025-08-16</td>
                <td>김영희</td>
                <td>댓글 등록</td>
              </tr>
              <tr>
                <td>2025-08-15</td>
                <td>이철수</td>
                <td>회원 가입</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </main>
</template>
