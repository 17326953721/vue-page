
var pageList = {
  props: ["totalpage", "jumppage"],
  template: `<div class = 'paging'>
    <ul>
      <li v-for = '(item,index) in pages' :class = "item.check ? 'check' : ''" @click = "clickPage(item, index)">{{item.page}}</li>
    </ul>
    <div class="jump" v-if="showSearch">
      <input type="text" v-model="jumpNum">
      <button @click="confirmClick">跳转</button>
    </div>
  </div>`,
  data() {
    return {
      pages: [],
      jumpNum: '',      //跳转页数 
      showLength: 6.   //分页一共显示多少个按钮    
    }
  },
  mounted() {
    if (this.totalpage > 10) {
      this.dom();
    } else {
      for (let i = 0; i < this.totalpage; i++) {
        this.pages.push({
          page: i + 1,
          check: false
        })
      }
      this.pages[0].check = true
    }
  },
  computed: {
    showSearch() {
      if(this.jumppage == 'true' || this.jumppage == true) {
        return true
      } else if(this.jumppage == 'false' || this.jumppage == false || !this.jumppage) {
        return false
      }
    }
  },
  methods: {
    dom() {
      let i = 0;
      while (this.totalpage < 10 && i < this.totalpage) {
        this.pages.push({
          page: i + 1,
          check: false
        });
        i++
      }
      while (this.totalpage > 10 && i < 4) {
        this.pages.push({
          page: i + 1,
          check: false
        });
        i++
      }
      while (this.totalpage > 10 && i > 3 && i < this.totalpage - 1) {
        if (i == 5) {
          this.pages.push({
            page: '···',
            check: false
          });
        }
        i++
      }
      while (this.totalpage > 10 && i == this.totalpage - 1) {
        this.pages.push({
          page: i + 1,
          check: false
        });
        i++
      }
      this.pages[0].check = true;
      this.$emit('clickpages', this.pages[0].page)
    },
    clickPage(item, index) {
      if (item.page != '···') {
        for (let i = 0; i < this.pages.length; i++) {
          this.pages[i].check = false;
        }
        item.check = true;
        this.$emit('clickpages', item.page)
      } else {
        let oldPages = Object.assign([], this.pages);
        this.pages = [];
        if (oldPages[index - 1].page == 1) {
          this.dom();
          return false
        }
        for (let i = 0; i < this.totalpage; i++) {
          if (i > oldPages[index - 1].page && i - oldPages[index - 1].page <= 3) {
            this.pages.push({
              page: i,
              check: false
            })
          }
        }
        this.pages[0].check = true;
        this.$emit('clickpages', this.pages[0].page)
        let newPage = this.pages[0].page;
        if (oldPages[index - 1].page >= 4) {
          this.pages.unshift({
            page: `···`,
            check: false
          });
          this.pages.unshift({
            page: 1,
            check: false
          });
          if (this.totalpage - newPage > 3) {
            this.pages.push({
              page: `···`,
              check: false
            });
            this.pages.push({
              page: this.totalpage,
              check: false
            });
          } else {
            this.pages.push({
              page: this.totalpage,
              check: false
            });
          }
        }
      }
      if (item.page == this.totalpage && this.totalpage > 10) {
        this.pages = [];
        for (let i = this.totalpage; i > 0; i--) {
          if (this.pages.length <= this.showLength - 3) {
            if (i == this.totalpage) {
              this.pages.unshift({
                page: i,
                check: true
              })
            } else {
              this.pages.unshift({
                page: i,
                check: false
              })
            }
          } else if (this.pages.length <= this.showLength - 2) {
            this.pages.unshift({
              page: '···',
              check: false
            })
          } else if (this.pages.length <= this.showLength - 1) {
            this.pages.unshift({
              page: 1,
              check: false
            })
          }
        }
      }
      if (item.page == 1) {
        this.pages = [];
        this.dom();
      }
    },
    confirmClick() {
      if(isNaN(Number(this.jumpNum)) || !this.jumpNum) {
        alert('请输入正确的数字');
        return false
      } else if(Number(this.jumpNum) > this.totalpage) {
        alert('已超过最大分页数，请重新输入');
        return false
      } else if(Number(this.jumpNum) < 1) {
        alert('请输入大于0的数字');
        return false
      }
      //如果输入值小于三 ，按照初始渲染
      if(this.jumpNum > 3) {
        this.pages = [];
        this.pages.push({ //渲染初始1
          check: false,
          page: 1
        })
        if(this.jumpNum - 1 > 2) {
          this.pages.push({
            check: false,
            page: '···'
          });
        }
        if(this.totalpage == this.jumpNum || this.totalpage - this.jumpNum < 2) {
          for(let i = this.totalpage - 3; i < this.totalpage; i++) {
            this.pages.push({
              check: false,
              page: i
            })
          }
        } else {
          for(let i = this.jumpNum - 1; i <= +this.jumpNum + 1; i++) {
            this.pages.push({
              check: false,
              page: i
            })
          }
        }
        if(this.totalpage - this.jumpNum >= 3) {
          this.pages.push({
            check: false,
            page: '···'
          });
        }
        this.pages.push({
          check: false,
          page: this.totalpage
        });
        this.pages.map(val => {
          if(val.page == this.jumpNum) {
            val.check = true;
            this.$emit('clickpages', val.page)
          }
        })
      } else {
        this.pages = [];
        this.dom()
      }
      
    }
  }
}

const vm = new Vue({
  el: '#app',
  components: {
    'page-list': pageList
  },
  methods: {
    clickpages(num) {
      console.log(num)
    }
  }
})