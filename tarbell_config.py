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
#CONTEXT_SOURCE_FILE="_spreadsheet.xlsx"

# Exclude these files from publication
EXCLUDES = ["*.md", "requirements.txt", "src/*", "node_modules"]

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
    'name': u'geografiadedolor',
    'title': u'Geografía del Dolor'
}

# Blueprint
import os
import sh

from clint.textui import puts, colored
from flask import Blueprint, abort, g
from tarbell.hooks import register_hook
from tarbell.slughifi import slughifi

blueprint = Blueprint('geografiadeldolor', __name__)

@blueprint.route('/espacio/<slug>/')
def espacio(slug):
    context = g.current_site.get_context()
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
    return g.current_site.preview("_espacio.html", extra_context)

@blueprint.app_template_filter()
def filter_quotes(arr):
    ret = [item for item in arr if (item.get("quote_en") or item.get("quote_es"))]
    return ret

@register_hook('generate')
def create_espacio_pages(site, output_root, quiet=False):
    if not quiet:
        puts("\nCreating espacio pages\n")

    data = site.get_context()
    markers = data["markers"]
    root_path = os.path.join(os.path.realpath(output_root), 'espacio/')

    for marker in markers:
        slug = slughifi(marker["state"].lower())
        page_path = os.path.join(root_path, slug)
        if not os.path.exists(page_path):
            os.makedirs(page_path)
        index_path = os.path.join(page_path, 'index.html')
        if not quiet:
            puts("Writing {0}/espacio/{1}.html".format(output_root, slug))
        with site.app.test_client() as client:
            resp = client.get('/espacio/{0}/'.format(slug))
        f = open(index_path, 'w')
        f.write(resp.data)
        f.close()

@register_hook('server_start')
def grunt_watch(site):
    """Start grunt watch"""
    grunt = sh.grunt.bake('watch', _cwd=site.path, _bg=True)
    proc = grunt()
    site.grunt_pid = proc.pid
    puts("Starting Grunt watch (pid: {0})".format(colored.yellow(proc.pid)))


@register_hook('server_stop')
def grunt_stop(site):
    """Stop grunt watch"""
    puts("Stopping Grunt watch")
    sh.kill(site.grunt_pid)


def setup_grunt(site, git):
    """Set up grunt"""
    os.chdir(site.path)
    puts("Installing node packages")
    print(sh.npm("install", _cwd=site.path))
    puts("Running grunt")
    print(sh.grunt(_cwd=site.path))


@register_hook('newproject')
def newproject_grunt(site, git):
    """Copy grunt files to new project and run setup"""
    blueprint_path = os.path.join(site.path, '_blueprint')

    puts("Copying Gruntfile.js to new project")
    shutil.copyfile(os.path.join(blueprint_path, 'Gruntfile.js'),
                    os.path.join(site.path, 'Gruntfile.js'))

    puts("Copying package.json to new project")
    shutil.copyfile(os.path.join(blueprint_path, 'package.json'),
                    os.path.join(site.path, 'package.json'))

    puts(git.add("Gruntfile.js"))
    puts(git.add("package.json"))
    puts(git.commit(m='Add Gruntfile.js and package.json'))

    _mkdir(os.path.join(site.path, 'src'))

    puts("Copying default assets")
    _mkdir(os.path.join(site.path, 'src/less'))
    shutil.copyfile(os.path.join(blueprint_path, 'src/less/main.less'),
                    os.path.join(site.path, 'src/less/main.less'))

    _mkdir(os.path.join(site.path, 'src/js'))
    shutil.copyfile(os.path.join(blueprint_path, 'src/js/app.js'),
                    os.path.join(site.path, 'src/js/app.js'))

    puts(git.add("src/js/app.js"))
    puts(git.add("src/less/main.less"))
    puts(git.commit(m='Add default javascript and LESS assets'))

    setup_grunt(site, git)


@register_hook('install')
def install_grunt(site, git):
    """Run grunt setup on project install"""
    setup_grunt(site, git)
