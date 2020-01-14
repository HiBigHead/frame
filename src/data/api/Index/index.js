import axiosApi from "@/common/utils/axiosApi";
import * as model from "./model";

// 获取菜单列表
export function getBB(params) {
  return axiosApi("/bb","get",
    model.getPermissionList,
    params
  );
}