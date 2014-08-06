# -*- coding: utf-8 -*-

"""
Tarbell project configuration
"""

# Short project name
NAME = "geografiadedolor"

# Descriptive title of project
TITLE = "Geografia de dolor"

# Google spreadsheet key
SPREADSHEET_KEY = "1_Duj8Upko57n-AXHFQCa_vy3zaJx19hjvnwPuX5otJo"

# Exclude these files from publication
EXCLUDES = ["*.md", "requirements.txt"]

# Spreadsheet cache lifetime in seconds. (Default: 4)
# SPREADSHEET_CACHE_TTL = 4 # Crappy connection aqui

# Create JSON data at ./data.json, disabled by default
# CREATE_JSON = True

# Get context from a local file or URL. This file can be a CSV or Excel
# spreadsheet file. Relative, absolute, and remote (http/https) paths can be 
# used.
# CONTEXT_SOURCE_FILE = ""

# EXPERIMENTAL: Path to a credentials file to authenticate with Google Drive.
# This is useful for for automated deployment. This option may be replaced by
# command line flag or environment variable. Take care not to commit or publish
# your credentials file.
# CREDENTIALS_PATH = ""

# S3 bucket configuration
S3_BUCKETS = {
  'staging': 'recoveredfactory.net/geografiadeldolor'
}

# Default template variables
DEFAULT_CONTEXT = {
    'name': 'geografiadedolor',
    'title': 'Geografia de dolor'
}