<script lang="ts">
import { defineComponent } from 'vue'
import { FileViewModel } from '@/viewmodel/FileViewMoldel.ts'
import axios from '@/plugins/axios'
import hghg from '@/components/Files/FileCreateComponent.vue'
import { FileCreatedto } from '@/Dtos/FileCreateDto.ts'
import GetAllComponent from '@/components/Files/FileGetAllComponenta.vue'
export default defineComponent({
  name: 'FileList', // Komponent nomini belgilash
  components: {
    hghg,
    GetAllComponent
  },
  methods: {
    openDeleteModal() {
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
    },

    //GetAll

    async getDataAsync() {
      try {
        const response = await axios.get<FileViewModel[]>('/api/files/getall')
        this.List = response.data
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },

    //Delete

    async DeleteAsync(fileName: string) {
      try {
        const response = await axios.delete('/api/files', {
          params: { filePath: fileName }
        })

        if (response.status === 200) {
          this.$router.push('/FileSystem')
          this.closeDeleteModal()
        } else {
          console.error('File deletion failed.')
        }
      } catch (error) {
        console.error('An error occurred:', error)
      }
    },
    async CreatAsync() {},

    handleFileChange(event) {
      this.formData.file = event.target.files[0]
      this.formData.fileName = event.target.files[0]?.name || '' // Safely get the file name
    },
    async handleSubmit() {
      debugger
      try {
        const formData = new FormData()
        formData.append('file', this.formData.file)

        const response = await axios.post('/api/files', formData)

        if (response.status === 200) {
          await this.getDataAsync() // Refresh the file list after creation
          alert('Item created successfully!')
        } else {
          console.error('File creation failed.')
          alert('Item was not created!')
        }
      } catch (error) {
        console.error('An error occurred:', error)
        alert('Item was not created!')
      }
    }
  },
  data() {
    return {
      showDeleteModal: false,
      List: [] as FileViewModel[],
      formData: new FileCreatedto()
    }
  },
  async mounted() {
    await this.getDataAsync()
  }
})
</script>



<template>
  <FlowbiteSetup></FlowbiteSetup>

  <!--begin::Create-->
  <div class="flex mx-32 my-16" style="gap: 10px">
    <input
      @change="handleFileChange"
      class="w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      id="default_size"
      type="file"
    />
    <button
      @click="handleSubmit"
      type="button"
      class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-10 text-center mr-2 mb-5"
    >
      Save
    </button>
  </div>
  <!--end::Create-->

  <!--end::GetAll-->

  <ul>
    <template v-for="element in List">
      <GetAllComponent :fileName="element.fileName"></GetAllComponent>
    </template>
  </ul>
  <!--end::GetAll-->
</template>
