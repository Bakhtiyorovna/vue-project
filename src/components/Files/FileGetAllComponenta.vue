<script lang="ts">
import { defineComponent } from 'vue'
import { FileViewModel } from '@/viewmodel/FileViewMoldel.ts'
import axios from '@/plugins/axios'
import hghg from '@/components/Files/FileCreateComponent.vue'

export default defineComponent({
  name: 'FileList', // Komponent nomini belgilash
  components: {},
  props: {
    fileName: String
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

    async DeleteAsync() {
      try {
        const response = await axios.delete('/api/files', {
          params: { filePath: this.fileName }
        })
        if (response.status === 200) {
          location.reload()
          this.closeDeleteModal()
        } else {
          console.error('File deletion failed.')
        }
      } catch (error) {
        console.error('An error occurred:', error)
      }
    },

    async downloadFile() {
      debugger
      try {
         this.fileUrl = "http://localhost:7131/files/"+this.fileName;
        const response = await axios.get(String( this.fileUrl) , {
          responseType: 'blob',
        });
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'filename.txt');
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Fayl yuklashda xatolik yuz berdi:', error);
      }

      // let fileURL = 'yourFileURL'

      // // Create a new anchor element
      // let link = document.createElement('a')
      // link.href = fileURL
      // link.target = '_blank' // Open in a new tab/window

      // // Trigger a click event on the anchor element
      // link.click()
    }
  },
  data() {
    return {
      showDeleteModal: false,
      List: [] as FileViewModel[],
      selectedFile: null as File | null,
      fileUrl: '' as String
    }
  },
  async mounted() {
    await this.getDataAsync()
  }
})
</script>



<template>
  <div class="mx-32 my-2">
    <a
      href="#"
      class="flex flex-col items-center border border-gray-200 rounded-lg shadow md:flex-row bg-gray-100 hover:bg-gray-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="34px"
        height="44px"
        viewBox="0 0 24 24"
        version="1.1"
        class="mx-5"
      >
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <polygon points="0 0 24 0 24 24 0 24" />
          <path
            d="M4.85714286,1 L11.7364114,1 C12.0910962,1 12.4343066,1.12568431 12.7051108,1.35473959 L17.4686994,5.3839416 C17.8056532,5.66894833 18,6.08787823 18,6.52920201 L18,19.0833333 C18,20.8738751 17.9795521,21 16.1428571,21 L4.85714286,21 C3.02044787,21 3,20.8738751 3,19.0833333 L3,2.91666667 C3,1.12612489 3.02044787,1 4.85714286,1 Z M8,12 C7.44771525,12 7,12.4477153 7,13 C7,13.5522847 7.44771525,14 8,14 L15,14 C15.5522847,14 16,13.5522847 16,13 C16,12.4477153 15.5522847,12 15,12 L8,12 Z M8,16 C7.44771525,16 7,16.4477153 7,17 C7,17.5522847 7.44771525,18 8,18 L11,18 C11.5522847,18 12,17.5522847 12,17 C12,16.4477153 11.5522847,16 11,16 L8,16 Z"
            fill="#000000"
            fill-rule="nonzero"
            opacity="0.3"
          />
          <path
            d="M6.85714286,3 L14.7364114,3 C15.0910962,3 15.4343066,3.12568431 15.7051108,3.35473959 L20.4686994,7.3839416 C20.8056532,7.66894833 21,8.08787823 21,8.52920201 L21,21.0833333 C21,22.8738751 20.9795521,23 19.1428571,23 L6.85714286,23 C5.02044787,23 5,22.8738751 5,21.0833333 L5,4.91666667 C5,3.12612489 5.02044787,3 6.85714286,3 Z M8,12 C7.44771525,12 7,12.4477153 7,13 C7,13.5522847 7.44771525,14 8,14 L15,14 C15.5522847,14 16,13.5522847 16,13 C16,12.4477153 15.5522847,12 15,12 L8,12 Z M8,16 C7.44771525,16 7,16.4477153 7,17 C7,17.5522847 7.44771525,18 8,18 L11,18 C11.5522847,18 12,17.5522847 12,17 C12,16.4477153 11.5522847,16 11,16 L8,16 Z"
            fill="#000000"
            fill-rule="nonzero"
            opacity="0.7"
          />
        </g>
      </svg>
      <div class="w-full flex py-2 px-4">
        <h5
          for="fileName"
          class="w-full mb-2 text-xl font-bold my-3 text-gray-900 dark:text-white w-136"
        >
          {{ fileName }}
        </h5>
        <button
          @click="downloadFile"
          type="button"
          class="h-10 my-1 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-0 text-center mx-5"
        >
          Download
        </button>
        <!--befin:: delete modal-->
        <div>
          <button
            type="button"
            @click="openDeleteModal"
            data-modal-target="staticModal"
            data-modal-toggle="staticModal"
            class="text-white my-1 bg-gradient-to-br from-red-600 to-red-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            style="margin-left: auto"
          >
            Delete
          </button>
          <div
            v-if="showDeleteModal"
            class="fixed top-0 left-0 right-0 z-50 w-full h-screen flex items-center justify-center bg-black bg-opacity-50"
          >
            <div class="relative w-full max-w-md max-h-full">
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  @click="closeDeleteModal"
                  class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="popup-modal"
                >
                  <svg
                    class="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span class="sr-only mt-10">Close modal</span>
                </button>
                <div class="p-6 text-center">
                  <h3 class="my-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this file?
                  </h3>
                  <button
                    @click="closeDeleteModal"
                    type="button"
                    class="text-gray-500 mr-6 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    @click="DeleteAsync"
                    type="button"
                    class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--befin:: delete modal-->
      </div>
    </a>
  </div>
</template>