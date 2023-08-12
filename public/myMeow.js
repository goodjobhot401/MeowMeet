// 我的街貓頁監聽 deleteMeow 按紐
const deleteMeowModal = document.getElementById('deleteMeowModal') || null
const deleteMeowButton = document.querySelectorAll('.deleteMeowButton') || null

if (deleteMeowButton) {
  deleteMeowButton.forEach(button => {
    button.addEventListener('click', async () => {
      const meowId = button.value
      // console.log('meowId是:' + meowId)

      const modalMeowName = deleteMeowModal.querySelector('#modalMeowName')
      const modalMeowImage = deleteMeowModal.querySelector('#modalMeowImage')
      const modalMeowForm = deleteMeowModal.querySelector('#modalMeowForm')

      const meow = await axios.get(`/api/meows/${meowId}`)
      const result = JSON.parse(JSON.stringify(meow.data))
      // console.log('這是 result:' + JSON.stringify(result))

      modalMeowName.textContent = `確定刪除 ${result.name} ?`
      modalMeowImage.src = result.avatar
      modalMeowForm.action = `/meows/${result.id}?_method=DELETE`
    })
  })
}

// 我的街貓頁監聽 deleteImage 按紐
const deleteImageModal = document.getElementById('deleteImageModal') || null
const deleteImageButton = document.querySelectorAll('.deleteImageButton') || null

if (deleteImageButton) {
  deleteImageButton.forEach(button => {
    button.addEventListener('click', async () => {
      const imageId = button.value
      // console.log('imageId是:' + imageId)

      const modalImageName = deleteImageModal.querySelector('#modalImageName')
      const modalImage = deleteImageModal.querySelector('#modalImage')
      const modalImageForm = deleteImageModal.querySelector('#modalImageForm')

      const image = await axios.get(`/api/meowImages/${imageId}`)
      const result = JSON.parse(JSON.stringify(image.data))
      // console.log('這是 result:' + JSON.stringify(result))

      modalImageName.textContent = `確定刪除 ${result.Meow.name} 的照片?`
      modalImage.src = result.image
      modalImageForm.action = `/meows/${result.id}/image?_method=DELETE`
    })
  })
}
