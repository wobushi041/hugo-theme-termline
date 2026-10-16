+++
title = "足迹组件演示"
date = "2026-01-01T00:00:00Z"
draft = false
type = "journeys"
layout = "single"
url = "/journeys"

subtitle = "地图状态、坐标与卡片布局示例"

# 以下地点、状态和日期均为虚构的组件演示数据，不代表真实行程。
# status: visited(已访问-翠绿色), planned(计划-暖橙色)
[[provinces]]
code = "230000"
name = "黑龙江省"
shortName = "黑龙江"
status = "visited"
cities = ["哈尔滨"]
count = 1

[[provinces]]
code = "510000"
name = "四川省"
shortName = "四川"
status = "visited"
cities = ["成都"]
count = 1

[[provinces]]
code = "460000"
name = "海南省"
shortName = "海南"
status = "planned"
cities = ["海口"]
count = 1

# 城市坐标仅用于演示地图散点。
[[cityCoordinates]]
name = "哈尔滨"
province = "黑龙江省"
lon = 126.6424
lat = 45.7567

[[cityCoordinates]]
name = "成都"
province = "四川省"
lon = 104.0665
lat = 30.5723

[[cityCoordinates]]
name = "海口"
province = "海南省"
lon = 110.1983
lat = 20.0440

# 卡片内容只描述被验证的界面状态。
[[spots]]
title = "已访问状态示例"
province = "黑龙江省"
city = "哈尔滨"
date = "2000-01-01"
content = "用于展示已访问省份的地图高亮、城市坐标和筛选卡片。"
postUrl = ""

[[spots]]
title = "城市筛选示例"
province = "四川省"
city = "成都"
date = "2000-02-01"
content = "用于展示城市视图、筛选按钮和卡片元信息的组合效果。"
postUrl = ""
+++

以下内容均为主题组件的演示数据，可在站点内容中完整替换。
