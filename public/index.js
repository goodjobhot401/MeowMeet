const searchForm = document.getElementById('search-form') || null
const searchButton = document.getElementById('search-button') || null

// 創建地圖
function initMap(latitude, longitude) {
  map = new google.maps.Map(document.getElementById('map'), {
    latitude: 25.03369,
    longitude: 121.56412,
    center: { lat: latitude, lng: longitude },
    zoom: 16
  })
}

if (searchForm && searchButton) {
  searchButton.addEventListener('click', async () => {
    try {
      // 獲取用戶輸入的地址
      const address = searchForm.value

      // 向後端查詢 googleApi 金鑰
      const result = await axios.get('/api/googleApi')
      const geocodingApiKey = result.data.googleApi.geocodingApiKey

      // geocoding api 請求網址
      const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${geocodingApiKey}`

      // 發送 geocoding api 請求
      const response = await axios.get(geocodingApiUrl)
      const results = response.data.results
      console.log(response)

      if (results.length > 0) {
        const location = results[0].geometry.location
        const latitude = location.lat
        const longitude = location.lng
        // const viewport = results[0].geometry.viewport
        console.log('緯度：' + latitude)
        console.log('經度：' + longitude)

        // 渲染地圖
        initMap(latitude, longitude)
      } else {
        console.log('找不到該地標地理位置')
      }
    } catch (err) {
      console.log(err)
    }
  })
}

