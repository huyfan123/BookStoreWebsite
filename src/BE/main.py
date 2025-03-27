from models.book import Book
from models.member import Member
from controllers.library_controller import LibraryController

def main():
    # Khởi tạo controller
    controller = LibraryController()
    
    # Tạo sách mẫu
    book1 = Book(book_id=1, title="1984", author="George Orwell", genre="Dystopia", year=1949, quantity=3)
    book2 = Book(book_id=2, title="Brave New World", author="Aldous Huxley", genre="Science Fiction", year=1932, quantity=2)
    
    # Tạo thành viên mẫu
    member1 = Member(member_id=1, name="Alice", email="alice@example.com")
    member2 = Member(member_id=2, name="Bob", email="bob@example.com")
    
    # Thêm sách và thành viên vào hệ thống
    controller.add_book(book1)
    controller.add_book(book2)
    controller.add_member(member1)
    controller.add_member(member2)
    
    # Hiển thị danh sách sách và thành viên
    print("Books in library:")
    for book in controller.get_books():
        print(book)
    
    print("\nMembers in library:")
    for member in controller.get_members():
        print(member)
        
if __name__ == '__main__':
    main()
