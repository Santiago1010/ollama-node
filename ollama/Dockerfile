FROM nvidia/cuda:12.2.2-runtime-ubuntu22.04

# Instala paquetes esenciales
RUN apt update && apt install -y curl lsof

# Instala Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

ENV OLLAMA_HOST=0.0.0.0

# Expone el puerto de Ollama
EXPOSE 11434

# Ejecuta Ollama sin la bandera --gpu (probablemente no se necesita)
CMD ollama serve & \
    sleep 5 && \
    # ollama run deepseek-r1:14b && \
    ollama run deepseek-llm:7b && \
    tail -f /dev/null
