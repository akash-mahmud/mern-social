1. clone the repo
2. put your mongodb atlas url on all config files
3. edit stack.yml to use your dockerhub
4. cd [function directory]
5. docker buildx build --platform linux/amd64,linux/arm64 -t [docker repo name with user name as you have mentioned on your stack.yml] --push .
6. faas-cli deploy
7. for checking your deployment status run kubectl get pods -n openfaas-fn 

