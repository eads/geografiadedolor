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
  'staging': 'recoveredfactory.net/geografiadeldolor',
  'production': 'www.geografiadeldolor.com',
}

# Default template variables
DEFAULT_CONTEXT = {
    'name': 'geografiadedolor',
    'title': 'Geografia de dolor'
}

# Blueprint
import os
from flask import Blueprint, abort
from tarbell.app import TarbellSite
from tarbell.slughifi import slughifi

from boto.s3.key import Key
from clint.textui import puts, colored
from tarbell.hooks import register_hook

blueprint = Blueprint('geografiadeldolor', __name__)

@blueprint.route('/espacio/<slug>/')
def espacio(slug):
    path = os.path.dirname(os.path.realpath(__file__))
    site = TarbellSite(path)
    context = site.get_context()
    markers = {}
    for marker in context["markers"]:
        marker["slug"] = slughifi(marker["state"].lower())
        markers[marker["slug"]] = marker

    if slug not in markers.keys():
        abort(404)

    extra_context = {
        "relative_root": "../../",
        "PATH": "%s.html" % slug,
    }
    extra_context.update(markers[slug])
    return site.preview("_espacio.html", extra_context)

@register_hook('publish')
def create_moment_stubs(site, s3):

    data = site.get_context()
    markers = data["markers"]
  
    for marker in markers:
        slug = slughifi(marker["state"].lower())

        k = Key(s3.connection)
        k.key = '{0}/espacio/{1}/index.html'.format(s3.bucket.path, slug)

        with site.app.test_request_context('/espacio/{0}/'.format(slug)):
            resp = espacio(slug)
        
        puts('Uploading {0}'.format(colored.yellow(k.key)))
        options = {'Content-Type': 'text/html',}
        k.set_contents_from_string(resp.data, options)
        k.set_acl('public-read')