"""Seed initial organization data for development."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.org import School, College, Major, Grade, Class
from app.models.user import User
from app.core.security import get_password_hash

Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(School).first():
            print("Database already seeded.")
            return

        # Create schools
        school = School(name="北京大学", code="PKU", address="北京市海淀区颐和园路5号")
        db.add(school)
        db.flush()

        # Create colleges
        cs_college = College(school_id=school.id, name="计算机科学与技术学院", code="CS")
        ee_college = College(school_id=school.id, name="信息科学技术学院", code="EE")
        db.add_all([cs_college, ee_college])
        db.flush()

        # Create majors
        cs_major = Major(college_id=cs_college.id, name="计算机科学与技术", code="CS01")
        ai_major = Major(college_id=cs_college.id, name="人工智能", code="AI01")
        se_major = Major(college_id=ee_college.id, name="软件工程", code="SE01")
        db.add_all([cs_major, ai_major, se_major])
        db.flush()

        # Create grades
        cs_grade_2022 = Grade(major_id=cs_major.id, year=2022)
        cs_grade_2023 = Grade(major_id=cs_major.id, year=2023)
        db.add_all([cs_grade_2022, cs_grade_2023])
        db.flush()

        # Create classes
        cs_class_2201 = Class(grade_id=cs_grade_2022.id, name="计科 2201 班", code="CS2201")
        cs_class_2202 = Class(grade_id=cs_grade_2022.id, name="计科 2202 班", code="CS2202")
        cs_class_2301 = Class(grade_id=cs_grade_2023.id, name="计科 2301 班", code="CS2301")
        db.add_all([cs_class_2201, cs_class_2202, cs_class_2301])
        db.flush()

        # Create admin user
        admin = User(
            username="admin",
            email="admin@campuslife.com",
            password_hash=get_password_hash("admin123"),
            role="super_admin",
            nickname="系统管理员",
            school_id=school.id,
            points=1000,
            level=10,
        )
        db.add(admin)

        # Create test student
        student = User(
            username="student",
            email="student@campuslife.com",
            password_hash=get_password_hash("student123"),
            role="student",
            nickname="小明同学",
            school_id=school.id,
            college_id=cs_college.id,
            major_id=cs_major.id,
            grade_id=cs_grade_2022.id,
            class_id=cs_class_2201.id,
            enrollment_year=2022,
            points=100,
            level=3,
        )
        db.add(student)

        db.commit()
        print("✅ Seed data created successfully!")
        print(f"  Admin: admin / admin123")
        print(f"  Student: student / student123")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
