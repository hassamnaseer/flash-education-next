import React, { Component } from "react";
import { connect } from "react-redux";
import { toaster } from "../../helper/Toaster";
import { getReport, getAllCategory } from "../../redux/actions//category";
import { Chart } from "react-google-charts";
import moment from "moment";
import { withRouter } from "next/router";

const Reports = withRouter(class extends Component {
    constructor(props) {
        super(props);
        let storageData = typeof window !== 'undefined' ?? localStorage.getItem("active_user_data")
            ? JSON.parse(localStorage.getItem("active_user_data"))
            : {};
        this.state = {
            user_id: storageData && storageData.login_user_id,
            graph_type: "Week",
            title: "",
            reports: [["Week", "Accuracy"]],
            categories: [],
            category_id: this.props.router.query && this.props.router.query.category_id
        };
    }
    componentWillMount() {
        if (this.state.category_id) {
            let params = {
                category_id: this.state.category_id,
                user_id: this.state.user_id,
                title: this.state.graph_type
            };
            this.props.getReport(params);
            this.setState({ category_id: this.state.category_id });
        }
        this.props.getAllCategory();

    }

    componentWillReceiveProps(newProps) {
        const { report_data, categories } = newProps;

        if (report_data && report_data.code === 200) {
            let reports = [["Week", "Accuracy"]];
            if (report_data.title === "Week") {
                {
                    Object.entries(report_data.graph_data).map((t, k) => {
                        let a = [moment(t[0]).format("ddd"), t[1]];
                        reports.push(a);
                    });
                }
            } else if (report_data.title === "Month") {
                {
                    Object.entries(report_data.graph_data).map((t, k) => {
                        // let a = [moment(t[0]).format("MMM"), t[1]];
                        let a = [moment(t[0]).format("DD/MMM"), t[1]];
                        reports.push(a);
                    });
                }
            }
            this.setState({
                reports: reports,
                title: report_data.title
            });
        } else if (report_data && report_data.code === 400) {
            return toaster("error", report_data.message);
        }

        if (categories && categories.code === 200) {
            this.setState({ categories: categories.data });
        }
    }

    handleTab = (e, name) => {
        let params = {
            category_id: this.state.category_id,
            user_id: this.state.user_id,
            title: name
        };
        this.props.getReport(params);
        this.setState({ graph_type: name, reports: [] });
    };

    handleSelect = (e, name) => {
        let params = {
            category_id: e.target.value,
            user_id: this.state.user_id,
            title: this.state.graph_type
        };
        this.props.getReport(params);
        this.setState({ [name]: e.target.value });
    };

    render() {
        const { reports, categories, category_id } = this.state;

        return (
            <div>
                <section className="cate-hdng new-cat-sec">
                    <div className="container">
                        <div className="cate_hdng">
                            <div className="category_heading">
                                <h1>Reports</h1>


                            </div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
                                lacus lorem. Mauris rutrum eget tortor quis molestie.
              </p>
                        </div>
                        <div className="filter_add add-1">
                            <h6>Please select a category:</h6>
                            <div className="form-group">
                                <select
                                    className="form-control"
                                    id="sel1"
                                    value={category_id}
                                    onChange={e => this.handleSelect(e, "category_id")}
                                >
                                    <option value="">Choose Categories</option>
                                    {categories && categories.map(data => {
                                        return (
                                            <option value={data.category_id}>{data.name}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                    </div>
                </section>
                <section className=" cate-sec all-reports-sec">
                    <div className="container">

                        <div className="row">
                            <div className="col-12 col-md-3">
                                <div className="sidebar_lft">
                                    <ul>
                                        <li>
                                            <button
                                                type="button"
                                                onClick={e => this.handleTab(e, "Week")}
                                            >
                                                Weekly
                      </button>
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                onClick={e => this.handleTab(e, "Month")}
                                            >
                                                Monthly
                      </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-12 col-md-9">
                                <div className="main_rgt">
                                    {reports.length > 1 && (
                                        <Chart
                                            width={"500px"}
                                            height={"300px"}
                                            chartType="AreaChart"
                                            //   loader={<div>Loading Chart</div>}
                                            data={reports}
                                            className='report_chart_class'
                                            options={{
                                                title: "Company Performance",
                                                hAxis: {
                                                    title: this.state.title,
                                                    titleTextStyle: { color: "#333" }
                                                },
                                                vAxis: { minValue: 0 }
                                                // // For the legend to fit, we make the chart area smaller
                                                // chartArea: { width: "50%", height: "70%" }
                                                // lineWidth: 25
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
})

const mapStateToProps = store => {
    return {
        report_data: store.category.report_data,
        categories: store.category.categories
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getReport: params => dispatch(getReport(params)),
        getAllCategory: params => dispatch(getAllCategory())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
