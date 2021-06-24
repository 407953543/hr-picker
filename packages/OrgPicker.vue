<template>
    <div class="selectContainer" :style="cssVars">
        <el-select
            v-model="val"
            filterable
            default-first-option
            remote
            ref="selector"
            :reserve-keyword="false"
            :placeholder="placeholder"
            :remote-method="remoteMethod"
            @change="onChange"
            @clear="clearList"
            @remove-tag="removeTag"
            value-key="deptid"
            :disabled="disabled"
            :multiple="true"
            :multiple-limit="multipleLimit"
            :loading="loading"
            :size="size"
            class="selector">
            <el-option
                v-for="item in orgList"
                :key="item.deptid"
                :label="item.descr"
                :value="{deptid:item.deptid,descr:item.descr,setid:item.setid}">
            </el-option>
        </el-select>
        <i class="el-icon-s-grid orgPickerIcon" @click="openDialog"></i>
        <org-picker-dialog :dialogVisibleOrgPicker="dialogVisibleOrgPicker"
                           :value="val"
                           :multipleLimit="multipleLimit"
                           @closeDialog="dialogVisibleOrgPicker=false"
                           @update="finishDialog"
                           :deptid="deptid"
                           :setid="setid"
                           append-to-body>
        </org-picker-dialog>
    </div>
</template>

<script>
    import OrgPickerDialog from './OrgPickerDialog';

    export default {
        components: { OrgPickerDialog },
        name: "OrgPicker",
        props: {
            placeholder: {
                type: String,
                default: '输入1个中文或2个英文可搜索'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            disabledMessage: {
                type: String
            },
            multipleLimit: {
                type: Number
            },
            value: {
                type: Array,
                default: function() {
                    return [];
                }
            },
            width: {
                type: Number
            },
            size: {
                type: String,
                default: 'small'
            },
            deptid: {
                type: String
            },
            setid: {
                type: String
            },
        },
        data() {
            return {
                val: [],
                loading: false,
                orgList: [],
                orgAllList: [],
                dialogVisibleOrgPicker: false,
            }
        },
        mounted() {
            this.orgAllList = [];
        },
        watch:{
            value: {
                handler(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        this.val = newVal;
                        this.orgList = JSON.parse(JSON.stringify(this.val));
                    }
                },
                immediate: true
            }
        },
        methods: {
            openDialog() {
                if(this.disabled) {
                    if(this.disabledMessage) {
                        this.$message({
                            showClose: true,
                            message: this.disabledMessage,
                            type: 'error'
                        });
                    }
                    return;
                }
                this.dialogVisibleOrgPicker = true;
                //隐藏selector下拉框
                this.orgList = [];
            },
            finishDialog(value) {
                this.val = JSON.parse(JSON.stringify(value));
                this.orgList = JSON.parse(JSON.stringify(this.val));
                this.$emit("update", this.val);
            },
            removeTag() {
                this.orgList = JSON.parse(JSON.stringify(this.val));
                this.$refs.selector.blur();
            },
            clearList() {
               this.orgList = [];
            },
            onChange(val) {
                this.$emit("update", this.val);
            },
            remoteMethod(query) {
                if(query) {
                    const reg = /^[\u4E00-\u9FA5a-z0-9][\u4E00-\u9FA5a-z0-9_.()]+$/i
                    const regChinese = /^[\u4E00-\u9FA5]+$/
                    if (reg.test(query) || regChinese.test(query)) {
                        this.loading = true;
                        this.remoteSearch().then(res => {
                            this.orgList = res;
                            this.orgList.filter(item => {
                                return item.descr.toLowerCase().indexOf(query.toLowerCase()) > -1;
                            });
                            this.loading = false;
                        });
                    }
                } else {
                    this.orgList = JSON.parse(JSON.stringify(this.val));
                    this.$refs.selector.blur();
                }
            },
            //异步请求
            async remoteSearch() {
                return new Promise((resolve, reject) => {
                    setTimeout(function(){
                        resolve([{
                            deptid: '1234', descr: '描述1234', setid: 'TME00'
                        }, {
                            deptid: '124', descr: '描述124', setid: 'TME00'
                        }, {
                            deptid: '134', descr: '描述134', setid: 'TME00'
                        }]);
                    }, 200);
                });
            },
        },
        computed: {
            cssVars() {
                return {
                    "--inputWidth": this.width ? this.width + 'px' : '100%',
                    "--iconOffset": this.width ? this.width + 8 + 'px' : 'calc(100% + 8px)',
                    "--iconSize": this.size === 'medium' ? '20px': '18px',
                };
            }
        }
    }
</script>

<style scoped>
    .selectContainer {
        position: relative;
        display: flex;
        align-items: center;
    }
    .selector {
        width: var(--inputWidth);
    }
    .orgPickerIcon {
        position: absolute;
        left: var(--iconOffset);
        cursor: pointer;
        font-size: var(--iconSize);
    }

</style>
