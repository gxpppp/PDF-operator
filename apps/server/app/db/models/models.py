from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class PdfDocument(Base):
    __tablename__ = "pdf_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String(1024), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size = Column(Integer, default=0)
    page_count = Column(Integer, default=0)
    title = Column(String(255), nullable=True)
    author = Column(String(255), nullable=True)
    subject = Column(String(255), nullable=True)
    keywords = Column(String(1024), nullable=True)
    creator = Column(String(255), nullable=True)
    producer = Column(String(255), nullable=True)
    creation_date = Column(DateTime, nullable=True)
    modification_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    history = relationship("ProcessingHistory", back_populates="document")


class ProcessingHistory(Base):
    __tablename__ = "processing_history"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("pdf_documents.id"))
    operation = Column(String(50), nullable=False)
    input_path = Column(String(1024), nullable=True)
    output_path = Column(String(1024), nullable=True)
    status = Column(String(20), default="pending")
    error_message = Column(Text, nullable=True)
    processing_time = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    document = relationship("PdfDocument", back_populates="history")


class BatchTask(Base):
    __tablename__ = "batch_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String(50), unique=True, index=True)
    operation = Column(String(50), nullable=False)
    status = Column(String(20), default="pending")
    total_files = Column(Integer, default=0)
    processed_files = Column(Integer, default=0)
    progress = Column(Integer, default=0)
    output_dir = Column(String(1024), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class Workflow(Base):
    __tablename__ = "workflows"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    steps = Column(Text, nullable=True)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class WorkflowRun(Base):
    __tablename__ = "workflow_runs"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id"))
    status = Column(String(20), default="pending")
    input_files = Column(Text, nullable=True)
    results = Column(Text, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class Plugin(Base):
    __tablename__ = "plugins"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    version = Column(String(50), nullable=False)
    author = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    enabled = Column(Boolean, default=True)
    installed_at = Column(DateTime, default=datetime.utcnow)


class Settings(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(255), unique=True, nullable=False)
    value = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
