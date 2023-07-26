const searchForm = document.getElementById('search-form') || null
const searchButton = document.getElementById('search-button') || null
const searchLocation = document.getElementById('search-location') || null
const locationInput = document.getElementById('locationInput') || null
const latitudeInput = document.getElementById('latitudeInput') || null
const longitudeInput = document.getElementById('longitudeInput') || null
const latitudeForm = document.getElementById('latitude-form') || null
const longitudeForm = document.getElementById('longitude-form') || null

// 創建地標資料
let markers = []
const meowData = { markers: [] }

// 創建初始化地圖
function initMap(latitude, longitude) {
  map = new google.maps.Map(document.getElementById('map'), {
    latitude: 25.03369,
    longitude: 121.56412,
    center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
    zoom: 16,
    styles: customMapStyle
  })

  // 獲取地圖的中心位置
  map.addListener('dragend', function () {
    const center = map.getCenter()
    console.log('新的中心位置緯度：' + parseFloat(center.lat().toFixed(6)))
    console.log('新的中心位置經度：' + parseFloat(center.lng().toFixed(6)))

    if (latitudeForm && longitudeForm) {
      latitudeForm.value = parseFloat(center.lat().toFixed(6))
      longitudeForm.value = parseFloat(center.lng().toFixed(6))
    }

    if (latitudeInput && longitudeInput) {
      latitudeInput.value = parseFloat(center.lat().toFixed(6))
      longitudeInput.value = parseFloat(center.lng().toFixed(6))
    }
  })

  // 創建地圖中心點的 icon
  icon = new google.maps.Marker({
    position: map.getCenter(),
    map,
    draggable: false, // 設置為false，以禁止手動拖動圖標
    icon: 'https://maps.google.com/mapfiles/ms/icons/pink-dot.png'
  })

  // 監聽地圖的拖移(drag)事件
  map.addListener('drag', function () {
    // 更新 icon 的位置為地圖的中心位置
    icon.setPosition(map.getCenter())
    // 重新渲染 icon
    renderViewportMarker()
  })

  // 地圖初始化完成時觸發
  google.maps.event.addListenerOnce(map, 'idle', function () {
    renderViewportMarker()
  })
}

// google map 客製化樣式
const customMapStyle = [
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  }
]

// 渲染地圖範圍內的 marker
async function renderViewportMarker() {
  // 清除舊的 markers 陣列資料
  markers = []

  // 取得目前地圖 viewport 範圍
  const bounds = map.getBounds()
  const ne = bounds.getNorthEast()
  const sw = bounds.getSouthWest()
  const viewport = {
    northeast: ne,
    southwest: sw
  }

  // 向後端發送 viewport 範圍
  const data = await axios.post('/api/markerData', { viewport })
  markers.push(data.data)

  // 將搜尋後的街貓資料渲染到地圖
  // markers 為包含陣列的陣列, 要取出當中的資料需要取第 0 項
  markers[0] = data.data
  markers[0].forEach(data => {
    const marker = new google.maps.Marker({
      position: { lat: Number(data.latitude), lng: Number(data.longitude) },
      map,
      title: data.name,
      icon: {
        url: 'https://i.imgur.com/gjnnjkd.png'
      }
    })
  })

  renderSearchResults(data.data)
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

// search 頁搜尋結果欄
function renderSearchResults(data) {
  const container = document.getElementById('searchResultsContainer')

  // 清空容器內的內容
  container.innerHTML = ''

  // 將搜尋結果的資料插入到容器中
  data.forEach(meow => {
    const card = document.createElement('a')
    card.href = `/meows/${meow.id}`
    card.className = 'card mb-3'
    card.style = 'width: 200px; height:360px; position: relative;'

    const image = document.createElement('img')
    image.src = `${meow.avatar}`
    image.className = 'card-img-top fixed-img'
    image.alt = '...'

    const gender = document.createElement('div')
    gender.className = 'gender'
    const genderIcon = document.createElement('i')
    genderIcon.className = 'genderIcon'
    if (meow.gender === 'female') {
      genderIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ff2590}</style><path d="M80 176a112 112 0 1 1 224 0A112 112 0 1 1 80 176zM224 349.1c81.9-15 144-86.8 144-173.1C368 78.8 289.2 0 192 0S16 78.8 16 176c0 86.3 62.1 158.1 144 173.1V384H128c-17.7 0-32 14.3-32 32s14.3 32 32 32h32v32c0 17.7 14.3 32 32 32s32-14.3 32-32V448h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H224V349.1z"/></svg>`
    } else if (meow.gender === 'male') {
      genderIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#1e3150}</style><path d="M289.8 46.8c3.7-9 12.5-14.8 22.2-14.8H424c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-33.4-33.4L321 204.2c19.5 28.4 31 62.7 31 99.8c0 97.2-78.8 176-176 176S0 401.2 0 304s78.8-176 176-176c37 0 71.4 11.4 99.8 31l52.6-52.6L295 73c-6.9-6.9-8.9-17.2-5.2-26.2zM400 80l0 0h0v0zM176 416a112 112 0 1 0 0-224 112 112 0 1 0 0 224z"/></svg>`
    } else {
      genderIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#787878}</style><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>`
    }
    gender.appendChild(genderIcon)

    const ul = document.createElement('ul')
    ul.className = 'list-group list-group-flush'

    const li1 = document.createElement('li')
    li1.className = 'list-group-item text-center'
    li1.innerHTML = `<span class="text-16px-med"> ${meow.name}</span>`

    const li2 = document.createElement('li')
    li2.className = 'list-group-item'
    li2.innerHTML = `<span class="text-14px-reg"><i class="fa-solid fa-paw me-1"
      style="color: #ff5290;"></i>親人：</span>`
    const friendly = meow.friendly
    for (let i = 0; i < friendly; i++) {
      const heart = document.createElement('i')
      heart.className = 'fa-solid fa-heart me-1'
      heart.style.color = '#ff5290'
      li2.appendChild(heart)
    }

    const li3 = document.createElement('li')
    li3.className = 'list-group-item'
    li3.innerHTML = `<span class="text-14px-reg"><i class="fa-solid fa-paw me-1"
      style="color: #ff5290;"></i>簡介：<br>${meow.intro}</span>`

    ul.appendChild(li1)
    ul.appendChild(li2)
    ul.appendChild(li3)

    card.appendChild(image)
    card.appendChild(gender)
    card.appendChild(ul)

    container.appendChild(card)
  })
}
