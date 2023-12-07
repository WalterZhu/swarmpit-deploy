# SWARMPIT-DEPLOY for github actions

本项目通过封装SWARMPIT提供的Restful-API，提供在github actions中向DOCKER SWARM集群部署服务的功能。

## 前置要求

- 部署DOCKER SWARM Cluster
- 在DOCKER SWARM Cluster上安装SWARMPIT服务
- 获取SWARMPIT API服务的地址（需开放访问）和API-TOKEN

## Usage

### 对已部署的service进行更新

- 以下是一个对已部署的service进行更新的例子
- 可以从swarmpit控制台里查看已部署service的id和name，注意大小写
- 至少提供service_id或者service_name其中之一
- 如果同时提供了service_id和service_name，以service_id为准
- 可以使用swarmpit控制台来维护service的部署描述（compose.yml）

```yaml
  steps:
    - name: Re-Deploy Service with Swarmpit
      uses: WalterZhu/swarmpit-deploy@v1
      with:
        swarmpit_uri: ${{ vars.SWARMPIT_URI }}   # swarmpit服务提供的URI，如 https://swarm.example.com/ ,必须
        swarmpit_token: ${{ secrets.SWARMPIT_TOKEN }}  # API访问的的TOKEN，如 Bearer ... ,必须
        service_id: ${{ vars.PRODUCTION_SERVICE_ID }}  # 需要更新的service id，非必须
        service_name: ${{ vars.PRODUCTION_SERVICE_NAME }} # 需要更新的service name，非必须
        tag: v1.0.0   # 部署service特定image tag，非必须，默认值为latest
```

### 初始化部署stack（暂不支持）

- 以下是一个初始化部署的stack进行deploy的例子
- swarmpit_uri和swarmpit_token和上例相同
- 此方法一般不建议使用，由于每个部署只一般只执行一次，可以考虑手动初始化部署stack

```yaml
  steps:
    - name: Deploy Stock with Swarmpit
      uses: WalterZhu/swarmpit-deploy@v1
      with:
        swarmpit_uri: ${{ vars.SWARMPIT_URI }}   # swarmpit服务提供的URI，如 https://swarm.example.com/ ,必须
        swarmpit_token: ${{ secrets.SWARMPIT_TOKEN }}  # API访问的的TOKEN，如 Bearer ... ,必须
        stock_name: ${{ vars.STOCK_NAME }}  # 部署STOCK的名称, 必须
        compose_file: ./docker-compose.yml  # 部署STOCK用的compose描述文件，必须
```
