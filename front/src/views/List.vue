<template>
  <div class="container-fluid">
    <div style="margin: 2em"></div>
    <div class="text-center">
      <img id="userAvatar" src="../assets/default_avatar.png" class="user-avatar img-circle img-responsive" alt="Responsive image">
    </div>
    <div style="margin: 1em"></div>
    <p class="text-center">{{user_info && user_info.nickname || '未知'}}</p>
    <div>
      <table class="table table-striped table-bordered">
        <thead>
          <tr class="danger">
            <th>序号</th>
            <th>时间</th>
            <th>问卷名</th>
            <th>得分</th>
          </tr>
        </thead>
        <tbody v-if="showData.length > 0">
          <tr v-for="(item, index) in showData">
            <th>
              {{index + 1}}
            </th>
            <th>
              {{item.time}}
            </th>
            <th>
              {{item.title}}
            </th>
            <th>
              {{item.score}}
            </th>
          </tr>
        </tbody>
        <tbody v-else>
          <tr class="active">
            <th colspan="4">
              <p class="text-center">暂无只记录</p>
            </th>
          </tr>
        </tbody>
      </table>
      <div class="pull-right">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li id="previousPage" v-show="pages > 2">
              <a href="#" aria-label="Previous" @click="previousPage">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li id="nextPage" v-show="pages > 2">
              <a aria-label="Next" @click="nextPage">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
            <li class="disabled" v-show="pages > 2">
              <span>第{{page}}页/共{{pages}}页</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="modal fade" id="listModal" tabindex="-1" role="dialog" aria-labelledby="listModalLabel">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="listModalLabel">{{message.title || '提示'}}</h4>
          </div>
          <div class="modal-body">{{message.des || '请稍候'}}</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Api from '../api'
  // import testCacse from '../query/test.json'
  export default {
    data() {
      return {
        user_info: null,
        page: 1,
        pages: 0,
        total: 0,
        limit: 10,
        message: {
          title: '',
          des: ''
        },
        listData: {},
        showData: []
      }
    },
    created() {
      this.checkLogin()
      // this.appendList(testCacse.answerList.data)
      $("title").html("个人中心")
    },
    // watch: {
    //   page: {
    //     handler: function (newValue, oldValue) {
    //       if (newValue <= 1) {
    //         $('#previousPage').addClass("disabled")
    //         $('#nextPage').removeClass("disabled")
    //       }
    //       if (newValue >= this.pages) {
    //         $('#previousPage').removeClass("disabled")
    //         $('#nextPage').addClass("disabled")
    //       }
    //     }
    //   }
    // },
    methods: {
      previousPage: function () {
        if (this.page <= 1) {
          this.message.des = '当前已是第一页'
          $('#listModal').modal('show')
          $('#previousPage').addClass("disabled")
          $('#nextPage').removeClass("disabled")
          return
        }
        this.page -= 1
        if (this.page <= 1) {
          $('#nextPage').removeClass("disabled")
          $('#previousPage').addClass("disabled")
        }
        this.checkData()
      },
      nextPage: function () {
        if (this.page >= this.pages) {
          this.message.des = '当前已是最后一页'
          $('#listModal').modal('show')
          $('#nextPage').addClass("disabled")
          $('#previousPage').removeClass("disabled")
          return
        }
        this.page += 1
        if (this.page >= this.pages) {
          $('#nextPage').addClass("disabled")
          $('#previousPage').removeClass("disabled")
        }
        this.checkData()
      },
      checkLogin: function () {
        if (!this.user_info) {
          let thiz = this
          Api.getLoginInfo(function (res) {
            if (res.ret === 1) {
              thiz.user_info = res.data
              if (res.data.avatar) $("#userAvatar").attr("src", res.data.avatar)
              thiz.getAnswer()
            } else {
              thiz.user_info = null
              thiz.message.title = '提示'
              thiz.message.des = '获取登陆信息失败，请刷新重试'
              $('#listModal').modal('show')
            }
          })
        }
      },
      getAnswer: function () {
        let thiz = this
        if (!this.user_info) {
          this.message.title = '提示'
          this.message.des = '您尚未登陆，请刷新重试'
          $('#listModal').modal('show')
          setTimeout(function () {
            $('#listModal').modal('hide')
            location.reload();
          }, 1000)
          return
        }

        this.message.title = '提示'
        this.message.des = '正在刷新数据，请稍后'
        Api.getAnswer({
          user_id: this.user_info.id,
          page: this.page,
          limit: 50
        }, function (res) {
          if (res.ret === 1) {
            $('#listModal').modal('hide')
            thiz.appendList(res.data)
          } else {
            thiz.message.title = '提示'
            thiz.message.des = res.msg || '获取数据失败，请重试'
            $('#listModal').modal('show')
          }
        })

      },
      appendList: function (data) {
        let page = data.page
        let limit = data.limit
        this.total = data.total
        let star_id = (page - 1) * limit + 1
        let end_id = page * limit
        for (let index = 0; star_id <= end_id && index < data.list.length; star_id++ , index++) {
          this.listData[star_id] = data.list[index]
        }
        this.checkPage()
        this.show()
      },
      show: function () {
        let page = this.page < 1 ? 1 : this.page
        let limit = this.limit
        let star_id = (page - 1) * limit + 1
        let end_id = page * limit
        let tmp_showData = []
        for (; star_id <= end_id; star_id++) {
          if (this.listData[star_id]) tmp_showData.push(this.listData[star_id])
        }
        this.showData = tmp_showData
      },
      checkData: function () {
        let page = this.page < 1 ? 1 : this.page
        let limit = this.limit
        let star_id = (page - 1) * limit + 1
        let end_id = page * limit
        for (; star_id <= end_id; star_id++) {
          if (!listData[star_id]) {
            this.getAnswer()
            return
          }
        }
        this.show()
      },
      checkPage: function () {
        let pageCount = this.total % this.limit === 0 ? this.total / this.limit : this.total / this.limit + 1
        this.pages = parseInt(pageCount)
      }
    }
  }
</script>
<style scoped>
  .user-avatar {
    height: 50%;
    width: 50%;
    margin: auto;
  }
</style>