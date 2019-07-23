(function () {

  // 宣告API組合變數
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users'
  const dataPanel = document.querySelector('#data-panel')
  const data = JSON.parse(localStorage.getItem('favoriteUser')) || []
  const ITEM_PER_PAGE = 24
  let paginationData = []

  getTotalPages(data)
  getPageData(1, data)

  // -------------------- EventListener ----------------------
  // listen to data panel  (event delegation)
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-user')) {
      showUser(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      console.log(event.target.dataset.id)
      removeFavoriteUser(event.target.dataset.id)
    }
  })

  // listen to paginatin click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })


  // -------------------- functions----------------------

  // pagination total page function
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
      <li class = "page-item">
        <a class = "page-link" href = "javascript:;" data-page = "${i + 1}">${i + 1}</a>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  // slice pagination function
  function getPageData(pageNum, data) {
    //新增變數解決pagination addeventlistener後沒有傳入值的問題
    paginationData = data || paginationData
    // step1: 計算出分頁前的總數量
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    // step2: 切割分頁前與分頁後數量
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }


  // Rendering user info in index
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (user) {
      htmlContent += `
      <div class = "col-lg-2 col-md-4 col-sm-6">
      <div class = "card mb-1">
        <img class ="card-img-top" src= "${user.avatar}" alt="user image cap">
        <div class = "card-body user-info-body">
        <h6 class= "user-name">${user.name} ${user.surname}</h6>
        <h6 class = "text-info"><i class="fa fa-map-marker" aria-hidden="true"></i> ${user.region}</h6>
        </div>

        <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-info btn-show-user" data-toggle="modal" data-target="#show-user-modal" data-id = "${user.id}">More</button>

         <!-- "remove" button -->
              <button class="btn btn-danger btn-remove-favorite" data-id="${user.id}"><i class="fa fa-trash" aria-hidden="true"></i></button>

            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }


  function showUser(id) {
    // set request url
    const url = INDEX_URL + `/${id}`
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      // const data = response.data.results
      const user = response.data
      // console.log(user)
      renderUserInfo(user)
    })
  }

  // Rendering User data in modal content 
  function renderUserInfo(user) {
    // get elements
    const modalProfile = document.getElementById('show-user-title')
    const modalAvatar = document.getElementById('show-user-avatar')
    const modalDetail = document.getElementById('show-user-detail')

    //判斷user是男生女生提供icon
    if (user.gender === "female") {
      modalProfile.innerHTML = `<i class="fa fa-venus" aria-hidden="true"></i>  ${user.name} ${user.surname}`
    } else {
      modalProfile.innerHTML = `<i class="fa fa-mars" aria-hidden="true"></i>  ${user.name} ${user.surname}`
    }

    modalAvatar.innerHTML = `<img src = "${user.avatar}" class = "img-fluid" alt="Responsive image">`
    modalDetail.innerHTML = `
    <h3>${user.name} ${user.surname}</h3>
    <p><i class="fa fa-map-marker" aria-hidden="true"></i>  
    ${user.region}</p>
    <br>
    <p><i class="fa fa-birthday-cake" aria-hidden="true"></i> ${user.birthday}</p>
    <p><i class="fa fa-envelope-o" aria-hidden="true"></i> ${user.email}</p>
  `
  }

  //移除使用者
  function removeFavoriteUser(id) {
    // find user by id
    const index = data.findIndex(user => user.id === Number(id))
    if (index === -1) return

    // remove user and update localStorage
    data.splice(index, 1)
    localStorage.setItem('favoriteUser', JSON.stringify(data))

    // // update dataList
    displayDataList(data)
  }

})()