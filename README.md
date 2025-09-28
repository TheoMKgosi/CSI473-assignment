# CSI473-assignment
1. **Clone / grab the code**

   ```bash
   git clone https://github.com/TheoMKgosi/CSI473-assignment.git
   cd CSI473-assignment
   ```

2. **Set up environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate     # Windows
   ```

3. **Install dependencies**

   ```bash
   pip -m pip install Django
   ```

4. **Database stuff (if needed)**

   ```bash
   cd assignment
   python manage.py migrate
   ```

5. **Run dev server**

   ```bash
   python manage.py runserver
   ```
