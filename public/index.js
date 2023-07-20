const searchForm = document.getElementById('search-form') || null
const searchButton = document.getElementById('search-button') || null
const searchLocation = document.getElementById('search-location') || null
const locationInput = document.getElementById('locationInput') || null
const latitudeInput = document.getElementById('latitudeInput') || null
const longitudeInput = document.getElementById('longitudeInput') || null
const latitudeForm = document.getElementById('latitude-form') || null
const longitudeForm = document.getElementById('longitude-form') || null


// 創建地圖
function initMap(latitude, longitude) {
  map = new google.maps.Map(document.getElementById('map'), {
    latitude: 25.03369,
    longitude: 121.56412,
    center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
    zoom: 16
  })

  // 獲取地圖的中心位置
  map.addListener('dragend', function () {
    const center = map.getCenter()
    console.log('新的中心位置緯度：' + center.lat().toFixed(6))
    console.log('新的中心位置經度：' + center.lng().toFixed(6))
    latitudeInput.value = center.lat().toFixed(6)
    longitudeInput.value = center.lng().toFixed(6)
    latitudeForm.value = center.lat().toFixed(6)
    longitudeForm.value = center.lng().toFixed(6)
  })

  // 創建地圖中心點的 icon 
  icon = new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    draggable: false, // 設置為false，以禁止手動拖動圖標
    icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  })

  // 監聽地圖的拖移(drag)事件
  map.addListener('drag', function () {
    // 更新 icon 的位置為地圖的中心位置
    icon.setPosition(map.getCenter())
  })
}

// search 頁 & create 頁 & edit 頁的 searchButton 設立監聽器
if (searchButton) {
  searchButton.addEventListener('click', async (event) => {
    // 預防刷新
    event.preventDefault()

    try {
      // 獲取用戶輸入的地址
      let address = ''
      if (searchForm) {
        address = searchForm.value
      } else if (searchForm === null && searchLocation) {
        address = searchLocation.value
        locationInput.value = address
      } else {
        address = '台灣'
      }

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

        // 重新渲染地圖
        initMap(latitude, longitude)
      } else {
        console.log('找不到該地標地理位置')
      }
    } catch {
      console.log(err)
    }
  })
}

// create 頁與 edit 頁的 google-map-modal
const findLocationModal = document.getElementById('findLocationModal') || null
