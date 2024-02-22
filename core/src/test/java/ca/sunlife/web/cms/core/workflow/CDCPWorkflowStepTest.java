package ca.sunlife.web.cms.core.workflow;

import javax.jcr.RepositoryException;
import javax.jcr.Session;


import com.adobe.granite.asset.api.AssetManager;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import org.apache.sling.api.resource.*;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.day.cq.search.result.SearchResult;
import com.day.cq.search.result.Hit;
import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import java.util.Collections;

import ca.sunlife.web.cms.core.configurations.CDCPWorkflowConfig;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


public class CDCPWorkflowStepTest {

    @Mock
    private ResourceResolverFactory resolverFactory;

    @Mock
    private ResourceResolver resourceResolver;

    @Mock
    private CDCPWorkflowConfig config;

    @Mock
    private QueryBuilder queryBuilder;

    @Mock
    private Query query;

    @Mock
    private SearchResult searchResult;

    @Mock
    private Hit hit;

    @Mock
    private AssetManager assetManager;

    @Mock
    private Asset asset;

    @InjectMocks
    private CDCPWorkflowStep workflowStep;

    @BeforeEach
    public void setUp() throws RepositoryException, LoginException {
        MockitoAnnotations.initMocks(this);
        when(resolverFactory.getServiceResourceResolver(any())).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(QueryBuilder.class)).thenReturn(queryBuilder);
        when(queryBuilder.createQuery(any(), any())).thenReturn(query);
        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getHits()).thenReturn(Collections.singletonList(hit));
        when(hit.getPath()).thenReturn("/content/dam/cdcp-pdfs/pdf1");
        when(resourceResolver.getResource("/content/dam/cdcp-json")).thenReturn(mock(Resource.class));
    }

    @Test
    public void testExecute_SuccessfulExecution() throws RepositoryException, WorkflowException, PersistenceException {
        // Mock necessary configuration
        when(config.cdcpPDFLocation()).thenReturn("/content/dam/cdcp-pdfs");
        when(config.cdcpJSONLocation()).thenReturn("/content/dam/cdcp-json");

        // Mock asset related methods
        when(resourceResolver.getResource("/content/dam/cdcp-pdfs/pdf1")).thenReturn(mock(Resource.class));
        when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);

        // Mock session
        Session session = mock(Session.class);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);

        // Execute the method
        assertDoesNotThrow(() -> workflowStep.execute(mock(WorkItem.class), mock(WorkflowSession.class), mock(MetaDataMap.class)));
    }

    @Test
    void testCreateJsonObject() throws JSONException {
        //Mock Data
        String assetName = "test.pdf";
        String dcTitle = "Test Title";
        String province = "Ontario";
        String year = "2024";

        when(asset.getName()).thenReturn(assetName);
        when(asset.getMetadataValue(DamConstants.DC_TITLE)).thenReturn(dcTitle);
        when(asset.getMetadataValue("dam:cdcp-province")).thenReturn(province);
        when(asset.getMetadataValue("dam:cdcp-year")).thenReturn(year);

        JSONObject jsonObject = workflowStep.createJsonObject(asset,false);

        assertEquals(assetName, jsonObject.getString("name"));
        assertEquals(dcTitle, jsonObject.getString("title"));
        assertEquals(province, jsonObject.getString("province"));
        assertEquals(year, jsonObject.getString("year"));

    }

}
