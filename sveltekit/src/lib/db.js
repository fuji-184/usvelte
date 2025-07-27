import  postgres from 'postgres';

const db = postgres('postgres://postgres:fuji123@localhost:5432/tes', {
  max: 1    
})

export default db;