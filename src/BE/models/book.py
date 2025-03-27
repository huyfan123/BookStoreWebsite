class Book:
    def __init__(self, book_id, title, author, genre, year, quantity):
        self.book_id = book_id
        self.title = title
        self.author = author
        self.genre = genre
        self.year = year
        self.quantity = quantity

    def __str__(self):
        return f"[{self.book_id}] {self.title} by {self.author} ({self.year}) - {self.quantity} copies"
