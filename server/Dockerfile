# 使用 Python 3 镜像作为基础
FROM python:3

# 设置工作目录
WORKDIR /app

# 将主应用程序复制到容器中的工作目录
COPY . .

# 安装依赖项
RUN pip install -r requirements.txt

# 指定容器启动时运行的命令
CMD ["python", "main.py"]
