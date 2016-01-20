#!/usr/bin/env bash
#
# Installs GCC. Run this in a screen session.
#

mkdir -p $HOME/bin $HOME/gcc/src $HOME/gcc/bin $HOME/gcc/lib

ln -s $HOME/gcc/lib $HOME/gcc/lib64  # only needed if we're on a 64-bit server.
  # we don't want to maintain two directories, and we're not using multilib.

set +h    # disable shell hashing so we can use binutils right away

# These are useful when running as a full script, to crash on any nonzero exit status
# However, in general, they should not be necessary for this guide.
# set -o errexit
# set -o nounset

# The dependencies are executed during gcc compilation; set run-time paths too
export PATH="$HOME/gcc/bin:$PATH"                       
export LD_LIBRARY_PATH="$HOME/gcc/lib:$LD_LIBRARY_PATH"

############################################################
# GNU Binutils
# Original: http://ftp.gnu.org/gnu/binutils/binutils-2.23.1.tar.bz2
############################################################
cd $HOME/gcc/src
wget 'http://mirror.ryansanden.com/gcc-4.8/binutils-2.23.1.tar.bz2'
tar -xjf binutils-2.23.1.tar.bz2
mkdir binutils-2.23.1-build
cd binutils-2.23.1-build
../binutils-2.23.1/configure --prefix=$HOME/gcc --disable-werror
make          # 4 min
make check
make install

############################################################
# GNU MP Bignum Library 5.1.2
# Original: http://ftp.gnu.org/gnu/gmp/gmp-5.1.2.tar.bz2
############################################################
cd $HOME/gcc/src
wget 'http://mirror.ryansanden.com/gcc-4.8/gmp-5.1.2.tar.bz2'
tar -xjf gmp-5.1.2.tar.bz2
cd gmp-5.1.2
CPPFLAGS=-fexceptions ./configure --prefix=$HOME/gcc --enable-cxx
make          # 2 min
make check    # 2 min
make install

############################################################
# GNU MFPR Library 3.1.2
# Original: http://www.mpfr.org/mpfr-current/mpfr-3.1.2.tar.bz2
############################################################
cd $HOME/gcc/src
wget 'http://mirror.ryansanden.com/gcc-4.8/mpfr-3.1.2.tar.bz2'
tar -xjf mpfr-3.1.2.tar.bz2
cd mpfr-3.1.2
./configure --prefix=$HOME/gcc --with-gmp=$HOME/gcc
make          # 1.5 min
make check    # 2 min
make install

############################################################
# MPC Library 1.0.1
# Original: http://www.multiprecision.org/mpc/download/mpc-1.0.1.tar.gz
############################################################
cd $HOME/gcc/src
wget 'http://mirror.ryansanden.com/gcc-4.8/mpc-1.0.1.tar.gz'
tar -xzf mpc-1.0.1.tar.gz
cd mpc-1.0.1
./configure --prefix=$HOME/gcc --with-gmp=$HOME/gcc --with-mpfr=$HOME/gcc
make          # 0.5 min
make check    # 1.5 min
make install

############################################################
# Parma Polyhedra (PPL) Library 1.0
# Original: http://bugseng.com/products/ppl/download/ftp/releases/1.0/ppl-1.0.tar.bz2
# Patch for GMP 5.1 compatibility: https://447928.bugs.gentoo.org/attachment.cgi?id=333770
############################################################
cd $HOME/gcc/src
wget 'http://mirror.ryansanden.com/gcc-4.8/ppl-1.0.tar.bz2'
tar -xjf ppl-1.0.tar.bz2
cd ppl-1.0
wget 'http://mirror.ryansanden.com/gcc-4.8/ppl-1.0.patch'
patch -p0 < ppl-1.0.patch
./configure --prefix=$HOME/gcc --with-gmp=$HOME/gcc
make          # 20 min
 #make check  # I killed it after 1hr 45min...
make install

############################################################
# CLooG-parma Library 0.16.1
# Original: http://www.bastoul.net/cloog/pages/download/count.php3?url=./cloog-parma-0.16.1.tar.gz
############################################################
cd $HOME/gcc/src
wget 'http://mirror.ryansanden.com/gcc-4.8/cloog-parma-0.16.1.tar.gz'
tar -xzf cloog-parma-0.16.1.tar.gz
cd cloog-parma-0.16.1
./configure --prefix=$HOME/gcc --with-ppl-prefix=$HOME/gcc --with-gmp-prefix=$HOME/gcc
make          # 20 sec
make check
make install

############################################################
# GCC 4.8.1
# Original: http://www.netgull.com/gcc/releases/gcc-4.8.1/gcc-4.8.1.tar.bz2
############################################################
cd $HOME/gcc/src
wget 'http://mirror.ryansanden.com/gcc-4.8/gcc-4.8.1.tar.bz2'
tar -xjf gcc-4.8.1.tar.bz2
mkdir gcc-4.8.1-build
cd gcc-4.8.1-build

# Configure it.  See http://gcc.gnu.org/install/configure.html
../gcc-4.8.1/configure --prefix=$HOME/gcc --with-local-prefix=$HOME/gcc \
    --with-gmp=$HOME/gcc --with-mpfr=$HOME/gcc --with-mpc=$HOME/gcc \
    --with-ppl=$HOME/gcc --with-cloog=$HOME/gcc \
    --with-system-zlib --with-gnu-as --with-gnu-ld \
    --enable-clocale=gnu --enable-shared --enable-threads=posix \
    --enable-__cxa_atexit --disable-nls --disable-multilib \

make          # 2 hours
make install

############################################################
# Clean up & set Environment
############################################################
set -h
rm -r $HOME/gcc/src
cd $HOME/gcc/bin && ln -s gcc cc

echo 'export PATH="$HOME/gcc/bin:$PATH"' >> $HOME/.bashrc
echo 'export CPPFLAGS="-I$HOME/gcc/include $CPPFLAGS"' >> $HOME/.bashrc
echo 'export LDFLAGS="-L$HOME/gcc/lib $LDFLAGS"' >> $HOME/.bashrc
echo 'export LD_LIBRARY_PATH="$HOME/gcc/lib:$LD_LIBRARY_PATH"' >> $HOME/.bashrc
