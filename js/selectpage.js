var template = `  <el-select size='mini' v-model="value" @blur="selectBlurName" placeholder="名字" @change="getitem" style="width:100px;" filterable :filter-method="dataFilter" clearable :loading="loading">
<el-option v-for="(item,index) in thedata" :label="item[bigdataconfig.label]" :value="item[bigdataconfig.value]"></el-option>
<div class='big-data-select-pagination' v-if="bigdataconfig.paging">
<el-pagination
          small
          v-show="dataopcopy.length>bigdataconfig.pagination.rows?true:false"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="rows"
          :pager-count="3"
          layout="prev, pager,next,total"
          :total="records"
        >
</div>
</el-select>`;

var BigDataSelect = Vue.component("BigDataSelect", {
    props: {
        bigdata: {
            type: Array,
            default () {
                return [];
            },
        },
        bigdataconfig: {
            type: Object,
            default: {
                placeholder: "名字",
                defaultvalue: "",
                defaultoptions: [],
                label: "label",
                value: "value",
                paging: true,
                pagination: {
                    page: 1,
                    rows: 10,
                },
            },
        },
    },
    data() {
        return {
            dataop: [],
            dataopcopy: [],
            thedata: [],
            value: "",
            loading: false,
            page: "",
            rows: "",
            records: "",
            config: {}
        };
    },
    mounted() {
        if (this.bigdataconfig.paging) {
            // 分页
            this.page = this.bigdataconfig.pagination.page;
            this.rows = this.bigdataconfig.pagination.rows;
        }
    },
    methods: {
        pagingData(data, step) {
            let newArr = [];
            for (let i = 0; i < data.length;) {
                newArr.push(data.slice(i, (i += step)));
            }
            return newArr;
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.page = val;
            this.thedata = this.dataop[val - 1];

            console.log(`当前页: ${val}`);
        },
        dataFilter(val) {
            this.value = val;
            if (val) {
                //val存在
                this.thedata = JSON.parse(JSON.stringify(this.dataopcopy)).filter(
                    (item) => {
                        console.log(item);
                        if (!!~item[this.bigdataconfig.label].indexOf(val) ||
                            !!~item[this.bigdataconfig.label]
                            .toUpperCase()
                            .indexOf(val.toUpperCase())
                        ) {
                            return true;
                        }
                    }
                );
            } else {
                //val为空时，还原数组
                this.thedata = this.dataop[this.page - 1];
            }
        },
        getitem(item, data) {
            console.log(item, data, "item");
        },
        // 姓名可输入
        selectBlurName(e) {
            this.value = e.target.value;
        },
        deepCopy(obj) {
            if (typeof obj !== "object") return;
            // 根据obj的类型判断是新建一个数组还是一个对象
            var newObj = obj instanceof Array ? [] : {};
            for (var key in obj) {
                // 遍历obj,并且判断是obj的属性才拷贝
                if (obj.hasOwnProperty(key)) {
                    // 判断属性值的类型，如果是对象递归调用深拷贝
                    newObj[key] =
                        typeof obj[key] === "object" ? this.deepCopy(obj[key]) : obj[key];
                }
            }
            return newObj;
        }
    },
    watch: {
        value: {
            handler(n, o) {
                if (n == "") {
                    this.thedata = this.dataop[0];
                    this.page = 1;
                }
                this.$emit("getbigdataselectval", n);
            },
            // immediate: true,
            // deep: true,
        },
        bigdata: {
            handler(n, o) {
                console.log(n, o);
                if (n.length > 0) {
                    this.$nextTick(() => {
                        this.dataop = this.pagingData(JSON.parse(JSON.stringify(n)), this.rows);
                        this.thedata = this.dataop[this.page - 1];
                        console.log(this.dataop);
                        this.dataopcopy = JSON.parse(JSON.stringify(n));
                        this.records = n.length;
                    })

                }

            },
            immediate: true,
            deep: true,
        },
    },
    template: template,
});


var style = document.createElement("style");
style.type = "text/css";
style.innerHTML = `
.big-data-select-pagination,.el-pagination__total{
    font-size: 10px !important; 
    -webkit-transform: scale(0.9);
    -webkit-transform-origin-X: left;
}
.big-data-select-pagination .el-pagination{
    position: static;
    display: block;
 }
`;
document.getElementsByTagName("head").item(0).appendChild(style);