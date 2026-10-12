#!/bin/bash
set -e
cd "$(dirname "$0")/../Extended_Langchain_Rag"
source venv/Scripts/activate
PYTHONUTF8=1 uvicorn app:app --reload --host 0.0.0.0 --port 8000
