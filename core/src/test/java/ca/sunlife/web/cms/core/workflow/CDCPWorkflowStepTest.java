package ca.sunlife.web.cms.core.workflow;

import javax.jcr.RepositoryException;
import javax.jcr.Session;


import com.adobe.granite.asset.api.AssetManager;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import org.apache.sling.api.resource.*;
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
}
