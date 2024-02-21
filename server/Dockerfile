# 使用 Python 3 镜像作为基础
FROM python:3.10.12

# 设置工作目录
WORKDIR /app

# 将主应用程序复制到容器中的工作目录
COPY . .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt --index-url https://pypi.tuna.tsinghua.edu.cn/simple

# 指定容器启动时运行的命令
CMD ["python", "main.py"]
