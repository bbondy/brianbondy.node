mkdir -p $HOME/src $HOME/tmp
export TMPDIR="$HOME/tmp"
export PATH="$HOME/bin:$PATH"
export C_INCLUDE_PATH="$HOME/include:$C_INCLUDE_PATH"
export LIBRARY_PATH="$HOME/lib:$LIBRARY_PATH"
export LD_LIBRARY_PATH="$HOME/lib:$LD_LIBRARY_PATH"
export CPPFLAGS="-I$HOME/include $CPPFLAGS"
export LDFLAGS="-L$HOME/lib $LDFLAGS"
export PKG_CONFIG_PATH="$HOME/lib/pkgconfig"

export PYTHON=python2.7
mkdir -p $HOME/lib/${PYTHON}

# =========================================
# pixman 0.24.4
# =========================================
cd $HOME/src
wget 'http://mirror.ryansanden.com/xfce-4.8/pixman-0.24.4.tar.gz'
tar -xzf pixman-0.24.4.tar.gz
cd pixman-0.24.4
./configure --prefix=$HOME
make
make install

# =========================================
# cairo 1.12.0
# =========================================
cd $HOME/src
wget 'http://mirror.ryansanden.com/xfce-4.8/cairo-1.12.0.tar.gz'
tar -xzf cairo-1.12.0.tar.gz
cd cairo-1.12.0
./configure --prefix=$HOME
make    # 2m
make install

# =========================================
# libffi 3.0.11
# =========================================
cd $HOME/src
wget 'http://mirror.ryansanden.com/xfce-4.8/libffi-3.0.11.tar.gz'
tar -xzf libffi-3.0.11.tar.gz
cd libffi-3.0.11
./configure --prefix=$HOME
make
make install

# =========================================
# Glib 2.31.22
# =========================================
cd $HOME/src
wget 'http://mirror.ryansanden.com/xfce-4.8/glib-2.31.22.tar.xz'
tar -xJf glib-2.31.22.tar.xz
cd glib-2.31.22
PYTHON=${PYTHON} ./configure --prefix=$HOME
make    # 2.5m
make install

# =========================================
# pango 1.30.0
# =========================================
cd $HOME/src
wget 'http://mirror.ryansanden.com/xfce-4.8/pango-1.30.0.tar.xz'
tar -xJf pango-1.30.0.tar.xz
cd pango-1.30.0
./configure --prefix=$HOME --sysconfdir=$HOME/etc
make    # 22s
make install

# =========================================
# pygobject 2.28.6
# =========================================
cd $HOME/src
wget 'http://mirror.ryansanden.com/xfce-4.8/pygobject-2.28.6.tar.bz2'
tar -xjf pygobject-2.28.6.tar.bz2
cd pygobject-2.28.6
PYTHON=${PYTHON} ./configure --prefix=$HOME --disable-introspection
make
make install

# =========================================
# py2cairo 1.10.0
# =========================================
cd $HOME/src
wget 'http://www.cairographics.org/releases/py2cairo-1.10.0.tar.bz2'
tar -xjf py2cairo-1.10.0.tar.bz2
cd py2cairo-1.10.0
$PYTHON ./waf configure --prefix=$HOME
$PYTHON ./waf build
$PYTHON ./waf install

# =========================================
# pygtk 2.24.0
# =========================================
cd $HOME/src
wget 'http://ftp.gnome.org/pub/GNOME/sources/pygtk/2.24/pygtk-2.24.0.tar.bz2'
tar -xjf pygtk-2.24.0.tar.bz2
cd pygtk-2.24.0
./configure --prefix=$HOME
make    # 22s
make install

cd $HOME/src
wget 'http://downloads.sourceforge.net/project/giflib/giflib-5.1.2.tar.bz2?r=&ts=1453281413&use_mirror=iweb'
mv giflib-5.1.2.tar.bz2\?r\=\&ts\=1453281413\&use_mirror\=iweb giflib-5.1.2.tar.bz2
tar -xjf giflib-5.1.2.tar.bz2
cd giflib-5.1.2
./configure --prefix=$HOME
make    # 22s
make install
