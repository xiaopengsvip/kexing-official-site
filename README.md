# 柯兴科技（深圳）有限公司官网

官网地址：https://kexing.allapple.top

本项目为柯兴科技企业官网源码，基于 Vite + React + TypeScript 构建。

## 技术栈
- Vite
- React
- TypeScript
- CSS

## 本地开发
1. 安装依赖
   npm install

2. 启动开发环境
   npm run dev

3. 打包构建
   npm run build

4. 本地预览
   npm run preview

## 项目结构
- src/：页面与样式源码
- public/：Logo、favicon、品牌素材、SEO 静态文件
- index.html：站点入口模板

## 部署说明
当前线上由 Caddy 托管静态构建产物，部署流程：
1. npm run build
2. 将 dist/ 同步到服务器站点目录
3. 验证 https://kexing.allapple.top 可访问

## 版权
版权所有 © 柯兴科技（深圳）有限公司。