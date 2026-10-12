# CampusMitra Makefile
# Backend: FastAPI (Extended_Langchain_Rag/) with Python venv
# Frontend: React/Vite (Frontend/) with npm

BACKEND_DIR := Extended_Langchain_Rag
FRONTEND_DIR := Frontend
VENV_DIR     := $(BACKEND_DIR)/venv
# After `cd $(BACKEND_DIR)`, activate path is relative to that dir
VENV_ACTIVATE_REL := venv/Scripts/activate

# Detect OS for venv activation path
ifeq ($(OS),Windows_NT)
  PYTHON      := python
  VENV_PYTHON := $(VENV_DIR)/Scripts/python
  VENV_PIP    := $(VENV_DIR)/Scripts/pip
  ACTIVATE    := source $(VENV_ACTIVATE_REL)
else
  PYTHON      := python3
  VENV_PYTHON := $(VENV_DIR)/bin/python
  VENV_PIP    := $(VENV_DIR)/bin/pip
  VENV_ACTIVATE_REL := venv/bin/activate
  ACTIVATE    := source $(VENV_ACTIVATE_REL)
endif

.PHONY: help \
        backend-venv backend-install backend-dev backend-run backend-clean \
        frontend-install frontend-dev frontend-build frontend-preview \
        install dev clean

# ─── Help ────────────────────────────────────────────────────────────────────

help:
	@echo ""
	@echo "CampusMitra — available targets"
	@echo ""
	@echo "  Backend (FastAPI + Python venv)"
	@echo "    make backend-venv      Create the Python virtual environment"
	@echo "    make backend-install   Install Python dependencies into venv"
	@echo "    make backend-dev       Start FastAPI with auto-reload (uvicorn)"
	@echo "    make backend-run       Start FastAPI without auto-reload"
	@echo "    make backend-clean     Remove the virtual environment"
	@echo ""
	@echo "  Frontend (React + Vite)"
	@echo "    make frontend-install  Install npm dependencies"
	@echo "    make frontend-dev      Start Vite dev server"
	@echo "    make frontend-build    Build for production"
	@echo "    make frontend-preview  Preview the production build"
	@echo ""
	@echo "  Combined"
	@echo "    make install           Install all backend + frontend dependencies"
	@echo "    make dev               Start both backend and frontend dev servers"
	@echo "    make clean             Remove venv and node_modules"
	@echo ""

# ─── Backend ─────────────────────────────────────────────────────────────────

backend-venv:
	cd $(BACKEND_DIR) && $(PYTHON) -m venv venv
	@echo "Virtual environment created at $(VENV_DIR)"
	@echo "To activate manually: cd $(BACKEND_DIR) && source $(VENV_ACTIVATE_REL)"

backend-install: backend-venv
	cd $(BACKEND_DIR) && $(ACTIVATE) && pip install --upgrade pip && pip install -r requirements.txt
	@echo "Backend dependencies installed."

backend-dev:
	@echo "Starting FastAPI dev server (auto-reload)..."
	bash scripts/start_backend.sh

backend-run:
	@echo "Starting FastAPI server..."
	cd $(BACKEND_DIR) && $(ACTIVATE) && PYTHONUTF8=1 uvicorn app:app --host 0.0.0.0 --port 8000

backend-clean:
	rm -rf $(VENV_DIR)
	@echo "Removed $(VENV_DIR)"

# ─── Frontend ────────────────────────────────────────────────────────────────

frontend-install:
	cd $(FRONTEND_DIR) && npm install
	@echo "Frontend dependencies installed."

frontend-dev:
	@echo "Starting Vite dev server..."
	cd $(FRONTEND_DIR) && npm run dev

frontend-build:
	cd $(FRONTEND_DIR) && npm run build

frontend-preview:
	cd $(FRONTEND_DIR) && npm run preview

# ─── Combined ────────────────────────────────────────────────────────────────

install: backend-install frontend-install
	@echo "All dependencies installed."

# Starts both servers with interleaved logs in terminal
dev:
	npx concurrently \
		--names "BACKEND,FRONTEND" \
		--prefix-colors "cyan,magenta" \
		"bash scripts/start_backend.sh" \
		"npm --prefix $(FRONTEND_DIR) run dev"

clean: backend-clean
	rm -rf $(FRONTEND_DIR)/node_modules
	@echo "Cleaned up node_modules."
