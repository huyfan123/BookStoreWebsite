class LibraryController:
    def __init__(self):
        self.books = []
        self.members = []

    def add_book(self, book):
        self.books.append(book)

    def add_member(self, member):
        self.members.append(member)

    def get_books(self):
        return self.books

    def get_members(self):
        return self.members
