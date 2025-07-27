package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	dbPool       *pgxpool.Pool
	templateHTML []byte
)

type User struct {
	ID           int       `json:"id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	FullName     string    `json:"full_name"`
	Gender       string    `json:"gender"`
	BirthDate    time.Time `json:"birth_date"`
	PhoneNumber  string    `json:"phone_number"`
}

func main() {
	var err error
	templateHTML, err = os.ReadFile("./index.html")
	if err != nil {
		log.Fatalf("Failed to read template file: %v", err)
	}

	dbPool, err = pgxpool.New(context.Background(), "postgres://postgres:fuji123@localhost:5432/tes")
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v", err)
	}
	defer dbPool.Close()

	http.HandleFunc("/api/users", usersHandler)
	http.HandleFunc("/assets/", assetsHandler)
	http.HandleFunc("/", appHandler)

	port := "8080"
	fmt.Printf("Listening on port %s\n", port)
	err = http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatalf("Server error: %v", err)
	}
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	rows, err := dbPool.Query(ctx, `
		SELECT id, username, email, password_hash, full_name, gender, birth_date, phone_number
		FROM users`)
	if err != nil {
		http.Error(w, "Database query failed", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []User

	for rows.Next() {
		var u User
		err := rows.Scan(
			&u.ID,
			&u.Username,
			&u.Email,
			&u.PasswordHash,
			&u.FullName,
			&u.Gender,
			&u.BirthDate,
			&u.PhoneNumber,
		)
		if err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}
		users = append(users, u)
	}

	if rows.Err() != nil {
		http.Error(w, "Error reading rows", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func assetsHandler(w http.ResponseWriter, r *http.Request) {
	fullPath := filepath.Join("dist/client", strings.TrimPrefix(r.URL.Path, "/assets/"))
	http.ServeFile(w, r, fullPath)
}

func appHandler(w http.ResponseWriter, r *http.Request) {
	html := strings.ReplaceAll(string(templateHTML), "<!--app-head-->", "<title>My App</title>")
	html = strings.ReplaceAll(html, "<!--app-html-->", fmt.Sprintf("<h1>Page for %s</h1>", r.URL.Path))
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(html))
}
