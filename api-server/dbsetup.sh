# Assume Homebrew installed and assume MySQL 5.7.19 not installed
# Note: If a different version of MySQL is installed, then you might need to do some extra work
# For different MySQL version: https://gist.github.com/benlinton/d24471729ed6c2ace731
brew install mysql

# Start agent for current version of mysql (including on login)
ln -sfv /usr/local/opt/mysql/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist

# Append the required environment variables into .bash_profile.
echo "export MYSQL_PATH=/usr/local/Cellar/mysql/5.7.19" >> ~/.bash_profile
echo "export PATH=\$PATH:\$MYSQL_PATH/bin" >> ~/.bash_profile

# Refresh environment variables
source ~/.bash_profile

# Set admin MySQL user and password
mysqluser='root'
mysqlpass=''

# Prepare statement for Quack DB dev user
dbsetup="CREATE database quackdbdev;CREATE USER 'quackdbuserdev'@'localhost' IDENTIFIED BY 'quackdbpassworddev';GRANT ALL PRIVILEGES ON *.* TO 'quackdbuserdev'@'localhost';FLUSH PRIVILEGES;"

# Login to admin and execute prepared SQL statement
mysql -u $mysqluser -p $mysqlpass -e "$dbsetup"

# Assume NodeJS + NPM installed
npm install -g knex

# Run migrations for database
knex migrate:latest

