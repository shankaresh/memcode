import CourseApi from '~/api/CourseApi';
import CourseCategoryApi from '~/api/CourseCategoryApi';

import { Helmet } from 'react-helmet';

import Main from '~/appComponents/Main';
import Loading from '~/components/Loading';
import SelectDropdown from '~/components/SelectDropdown';
import CourseCategories from '~/appComponents/CourseCategories';
import ListOfCourseCards from '~/appComponents/ListOfCourseCards';
import { ForBeginners } from './components/ForBeginners';

import css from './index.css';

const getCategoryId = (props) => {
  const categoryId = getQuery(props).get('categoryId');
  return categoryId ? parseInt(categoryId) : false;
};

const getQuery = (props) =>
  new URLSearchParams(props.location.search);

class Page_courses_learning extends React.Component {
  state = {
    speGetCourses: {},
    speGetCategories: {},
    tab: 'learning'
  }

  componentDidMount = () => {
    this.apiGetCourses();
    this.apiGetCreatedCourses();
    this.apiGetCategories();
  }

  apiGetCategories = () =>
    CourseCategoryApi.selectWithGroups(
      (spe) => this.setState({ speGetCategories: spe })
    )

  apiGetCourses = () =>
    CourseApi.selectAllLearned(
      spe => this.setState({ speGetCourses: spe })
    )

  apiGetCreatedCourses = () =>
    CourseApi.selectAllCreated(
      spe => this.setState({ speGetCreatedCourses: spe })
    )

  filterCoursesForCategory = (coursesData) => {
    const categoryId = getCategoryId(this.props);
    if (categoryId) {
      return coursesData.filter((courseData) =>
        courseData.course.courseCategoryId === categoryId
      );
    } else {
      return coursesData;
    }
  }

  filterCourseCategoriesForUser = (courseCategories) => {
    const coursesData = this.state.tab === 'learning' ?
      this.state.speGetCourses.payload :
      this.state.speGetCreatedCourses.payload;

    return courseCategories.map((courseCategory) => ({
      ...courseCategory,
      amountOfCourses: coursesData.filter((courseData) =>
        courseData.course.courseCategoryId === courseCategory.id
      ).length
    }));
  }

  renderFilter = () =>
    <SelectDropdown
      className="sort-by-dropdown-wrapper standard-dropdown-wrapper standard-input -Select"
      dropdownClassName="standard-dropdown -purple"
      value={this.state.tab}
      updateValue={(tab) => this.setState({ tab })}
      possibleValues={{
        learning: 'Learning',
        created: 'Created'
      }}
      renderLi={(value, humanValue) => humanValue}
    />

  render = () =>
    <Main className={css.main}>
      <Loading spe={this.state.speGetCategories}>{({ courseCategoryGroups, courseCategories }) =>
        this.state.tab === 'learning' ?
          <Loading spe={this.state.speGetCourses}>{(coursesData) =>
            coursesData.length === 0 ?
              <ForBeginners/> :
              <div className="container standard-navigation_and_courses">
                <CourseCategories
                  selectedCourseCategoryId={getCategoryId(this.props)}
                  courseCategoryGroups={courseCategoryGroups}
                  courseCategories={this.filterCourseCategoriesForUser(courseCategories)}
                  ifShowAmountOfCoursesInCategory
                />
                <div className="title_and_sorting_and_courses">
                  <div className="title_and_sorting">
                    <h1 className="title">My Courses</h1>

                    {this.renderFilter()}
                  </div>

                  <ListOfCourseCards
                    className="list-of-courses"
                    type="learnReview"
                    courseDtos={this.filterCoursesForCategory(coursesData)}
                  />
                </div>
              </div>
          }</Loading> :
          <Loading spe={this.state.speGetCreatedCourses}>{(coursesData) =>
            coursesData.length === 0 ?
              <ForBeginners/> :
              <div className="container standard-navigation_and_courses">
                <CourseCategories
                  selectedCourseCategoryId={getCategoryId(this.props)}
                  courseCategoryGroups={courseCategoryGroups}
                  courseCategories={this.filterCourseCategoriesForUser(courseCategories)}
                  ifShowAmountOfCoursesInCategory
                />
                <div className="title_and_sorting_and_courses">
                  <div className="title_and_sorting">
                    <h1 className="title">My Courses</h1>

                    {this.renderFilter()}
                  </div>

                  <ListOfCourseCards
                    className="list-of-courses"
                    type="simple"
                    courseDtos={this.filterCoursesForCategory(coursesData)}
                  />
                </div>
              </div>
          }</Loading>
      }</Loading>

      <Helmet>
        <title>Memcode | Learned Courses</title>
      </Helmet>
    </Main>
}

export default Page_courses_learning;
